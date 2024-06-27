import Evidence from "../models/Evidence.js";
import Report from "../models/Report.js";
import { responseData } from "../utils/responseHandler.js";

export const index = async (req, res) => {
    const evidence = await Evidence.findAll();
    return responseData(res, 200, evidence);
}

export const show = async (req, res) => {
    const id = req.params.id
    const evidence = await Evidence.findByPk(id);
    return responseData(res, 200, evidence);
}

export const create = async (req, res) => {
    const input = {
        reportId: req.body.reportId,
        path: req.body.path
    }
    const evidence = await Evidence.create(input);
    return responseData(res, 200, evidence, 'Laporan berhasil dibuat');
}

export const update = async (req, res) => {
    const id = req.params.id
    const input = {
        reportId: req.body.reportId,
        path: req.body.path
    }
    const evidence = await Evidence.update(input, { where: { id: id } });
    return responseData(res, 200, evidence, 'Laporan berhasil diubah');
}

export const destroy = async (req, res) => {
    const id = req.params.id
    const evidence = await Evidence.destroy({ where: { id: id } });

    return responseData(res, 200, evidence, 'Laporan berhasil dihapus');
}