"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BomController = void 0;
const bom_service_1 = require("./bom.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
class BomController {
    constructor() {
        this.getBoms = async (req, res) => {
            try {
                const boms = await this.bomService.getAllBoms();
                res.json({
                    success: true,
                    data: boms
                });
            }
            catch (error) {
                logger_1.logger.error('Get BOMs controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.getBomById = async (req, res) => {
            try {
                const { id } = req.params;
                const bom = await this.bomService.getBomById(id);
                res.json({
                    success: true,
                    data: bom
                });
            }
            catch (error) {
                logger_1.logger.error('Get BOM by ID controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.createBom = async (req, res) => {
            try {
                const bomData = req.body;
                const bom = await this.bomService.createBom(bomData);
                res.status(201).json({
                    success: true,
                    message: 'BOM created successfully',
                    data: bom
                });
            }
            catch (error) {
                logger_1.logger.error('Create BOM controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.updateBom = async (req, res) => {
            try {
                const { id } = req.params;
                const bomData = req.body;
                const bom = await this.bomService.updateBom(id, bomData);
                res.json({
                    success: true,
                    message: 'BOM updated successfully',
                    data: bom
                });
            }
            catch (error) {
                logger_1.logger.error('Update BOM controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.deleteBom = async (req, res) => {
            try {
                const { id } = req.params;
                await this.bomService.deleteBom(id);
                res.json({
                    success: true,
                    message: 'BOM deleted successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Delete BOM controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.bomService = new bom_service_1.BomService();
    }
}
exports.BomController = BomController;
//# sourceMappingURL=bom.controller.js.map