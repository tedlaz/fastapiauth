from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import auth_route
from employee_tst import route as employee_tst_route

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_route)
app.include_router(employee_tst_route)
