from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import EvaluationReportResponse
from backend.services.evaluation_engine import run_evaluation_benchmark

router = APIRouter(prefix="/api/evaluation", tags=["Evaluation Benchmark"])

@router.get("", response_model=EvaluationReportResponse)
def get_evaluation_metrics(db: Session = Depends(get_db)):
    return run_evaluation_benchmark(db)
