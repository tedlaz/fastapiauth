# FastAPI Authentication Project

This project implements a robust authentication system using FastAPI, a modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints. Use it as a template for fastapi projects.

## Features

- User registration and login
- JWT (JSON Web Token) based authentication
- Secure password hashing
- Role-based access control
- Token refresh mechanism
- Logout functionality

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/tedlaz/fastapiauth.git
   cd fastapiauth
   ```

2. Create a virtual environment:

   ```
   python -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Start the FastAPI server:

   ```
   uvicorn main:app --reload
   ```

2. Open your browser and navigate to `http://localhost:8000/docs` to access the Swagger UI documentation.

3. Use the provided endpoints to register users, login, and authenticate requests.

## Dependencies

- FastAPI
- Pydantic
- SQLAlchemy (for database ORM)
- bcrypt (for password hashing)
- python-jose (for JWT tokens)
- uvicorn (ASGI server)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

---

For more detailed information on FastAPI, please refer to the [official documentation](https://fastapi.tiangolo.com/).
