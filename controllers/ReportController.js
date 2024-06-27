import Evidence from "../models/Evidence.js";
import Report from "../models/Report.js";
import { responseData, responseMessage } from "../utils/responseHandler.js";
import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs'

export const index = async (req, res) => {
    var filter = {}
    if (req.user.role == 'USER')
        filter.userId = req.user.id

    if (req.query.category)
        filter.category = req.query.category

    if (req.query.status)
        filter.status = req.query.status

    const report = await Report.findAndCountAll({
        where: { ...filter },
        include: [{
            model: Evidence
        }]
    });
    return responseData(res, 200, report);
}

export const show = async (req, res) => {
    const id = req.params.id
    const report = await Report.findByPk(id);
    return responseData(res, 200, report);
}

export const create = async (req, res) => {
    try {
        // const files = req.files;
        // if (!files || files.length === 0) return res.status(400).send('No files uploaded.');

        const file = req.file;
        if (!file) return res.status(400).send('No files uploaded.');

        const input = {
            userId: req.user.id,
            title: req.body.title,
            detail: req.body.detail,
            location: req.body.location,
            category: req.body.category,
            status: req.body.status,
            lisencePlate: req.body.lisencePlate,
            // lisencePlateExpiry: req.body.lisencePlateExpiry
        }

        const report = await Report.create(input);
        // files.forEach(async file => {
        //     input.reportId = await report.id
        //     input.path = await file.path
        //     await Evidence.create(input)
        // })

        input.reportId = await report.id
        input.path = await file.path
        await Evidence.create(input)

        return responseData(res, 200, report, 'Laporan berhasil dibuat');
    } catch (error) {
        return responseData(res, 500, error, 'Laporan gagal dibuat');
    }
}

export const update = async (req, res) => {
    const id = req.params.id
    const data = {
        title: req.body.title,
        detail: req.body.detail,
        location: req.body.location,
        evidence: req.body.evidence,
        category: req.body.category,
        status: req.body.status,
        lisencePlate: req.body.lisencePlate,
        lisencePlateExpiry: req.body.lisencePlateExpiry
    }
    const report = await Report.update(data, { where: { id: id } });
    return responseData(res, 200, report, 'Laporan berhasil diubah');
}

export const destroy = async (req, res) => {
    const id = req.params.id
    const report = await Report.findByPk(id);
    report.destroy();
    return responseData(res, 200, report, 'Laporan berhasil dihapus');
}

export const updateStatus = async (req, res) => {
    const id = req.params.id
    const data = {
        status: req.body.status
    }
    const report = await Report.update(data, { where: { id: id } });
    return responseData(res, 200, report, 'Laporan berhasil diubah');
}

export const getStatistics = async (req, res) => {
    const user = req.user
    var filter = {}
    if (user.role == 'USER') {
        filter.userId = user.id
    }

    const report = await Report.findAll({ where: { ...filter } });
    const count = report.length
    const open = report.filter(report => report.status == 'OPEN').length
    const processed = report.filter(report => report.status == 'PROCESSED').length
    const resolved = report.filter(report => report.status == 'RESOLVED').length
    const rejected = report.filter(report => report.status == 'REJECTED').length
    const illegal_parking_percentage = report.filter(report => report.category == 'ILLEGAL_PARKING').length / count * 100
    const double_parking_percentage = report.filter(report => report.category == 'DOUBLE_PARKING').length / count * 100
    const facility_damage_percentage = report.filter(report => report.category == 'FACILITY_DAMAGE').length / count * 100

    const data = {
        count,
        open,
        processed,
        resolved,
        rejected,
        illegal_parking_percentage,
        double_parking_percentage,
        facility_damage_percentage
    }
    return responseData(res, 200, data);
}

export const detectLicencePlate = async (req, res) => {
    try {
        const file = req.file
        if (!file) return res.status(400).send('No files uploaded.');

        const base64 = fs.readFileSync(file.path, "base64");

        const image = {
            inlineData: {
                mimeType: file.mimetype,
                data: base64
            }
        }
        try {
            const detectedLisencePlate = await getResultFromImage(image);
            return responseData(res, 200, detectedLisencePlate);
        } catch (error) {
            console.error('Error detecting lisencePlate:', error);
            return responseMessage(res, 500, error, 'Error while detecting Lisence Plate');
        }
    } catch (error) {
        console.error('Error generating suggestion:', error);
        return responseMessage(res, 500, error, 'Internal Server Error');
    }
}

export const getResultFromImage = async (image) => {
    const vertexAI = new VertexAI({
        project: process.env.GCP_PROJECT_ID,
        location: process.env.GCP_PROJECT_LOCATION,
    });

    // Instantiate the model
    const generativeVisionModel = vertexAI.getGenerativeModel({
        model: 'gemini-1.0-pro-vision-001',
    });

    const prompt = `
        Baca teks pada plat nomor pada gambar ini, berikan hasilnya dalam format JSON.
        
        JSON hanya berisi key-key berikut: 
        lisencePlate: string, 
        lisencePlateExpiry: date,
        
        langsung saja berikan JSON-nya, dan pastikan JSON ditulis sampai selesai `

    const request = {
        contents: [
            {
                role: 'user',
                parts: [image, {
                    text: prompt
                }]
            }
        ],
    };

    // Create the response stream
    const responseStream =
        await generativeVisionModel.generateContentStream(request);

    // Wait for the response stream to complete
    const aggregatedResponse = await responseStream.response;

    // Select the text from the response
    const fullTextResponse =
        aggregatedResponse.candidates[0].content.parts[0].text.replace("```json", "").replace("```", "");
    return JSON.parse(fullTextResponse);
}