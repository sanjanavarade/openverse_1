import { RequestHandler } from 'express';
import logger from '../utils/logger.util';

/* ===================== PRACTICE PROBLEMS ===================== */

const getPracticeProblems: RequestHandler = async (_req, res) => {
  try {
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    logger.error('Get practice problems error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch practice problems',
    });
  }
};

const getPracticeProblem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    logger.error('Get practice problem error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch practice problem',
    });
  }
};

const submitPracticeSolution: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;

    if (!solution) {
      res.status(400).json({
        success: false,
        error: 'Solution is required',
      });
      return;
    }

    res.json({
      success: true,
      message: `Solution submitted for problem ${id}`,
    });
  } catch (error) {
    logger.error('Submit practice solution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit solution',
    });
  }
};

/* ===================== DEFAULT EXPORT ===================== */

const practiceController = {
  getPracticeProblems,
  getPracticeProblem,
  submitPracticeSolution,
};

export default practiceController;
