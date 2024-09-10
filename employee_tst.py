from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, Float, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

from auth import User, get_current_user

DB = "sqlite:///./employees.db"

route = APIRouter(prefix="/employees", tags=["Employees"])

# SQLite3 Database Configuration
engine = create_engine(DB, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# SQLAlchemy Models
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    position = Column(String)
    salary = Column(Float)


# Create tables in the database
Base.metadata.create_all(bind=engine)


# Pydantic Models
class EmployeeCreate(BaseModel):
    name: str
    position: str
    salary: float


class EmployeeResponse(BaseModel):
    id: int
    name: str
    position: str
    salary: float


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@route.get("/employees/", response_model=list[EmployeeResponse])
async def read_employees(
    db: Session = Depends(get_db), cuser: User = Depends(get_current_user)
):
    employees = db.query(Employee).all()
    return employees


@route.post("/employees/", response_model=EmployeeResponse)
async def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_employee = Employee(
        name=employee.name, position=employee.position, salary=employee.salary
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@route.put("/employees/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    if employee.name:
        db_employee.name = employee.name
    if employee.position:
        db_employee.position = employee.position
    if employee.salary:
        db_employee.salary = employee.salary
    db.commit()
    db.refresh(db_employee)
    return db_employee


@route.delete("/employees/{employee_id}")
async def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}
