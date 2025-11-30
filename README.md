#### HOW TO SETUP THE APPLICATION

-	Clone the project from GITHUB repository: https://github.com/rigs05/ubtds
-	Go to UBTDS folder
-	Initialize the frontend and backend: _npm install_
-	Initialize the database: Open terminal in “backend” director → _npx prisma migrate dev_
-	Populate the Users in DB → _npx prisma db seed_
  -	It’ll create a sample Users for all the roles:
    -	Admin: admin@ubtds.test – Admin@123
    -	RC-Admin: rcadmin@ubtds.test - Admin@123
    -	Distributor: distributor@ubtds.test - Distributor@123
    -	Student: student@ubtds.test – Student@123
-	Generate the Prisma Client → _npx prisma generate_
-	RUN the App:
  - Frontend: _npm run dev_
o	Backend:
  - _npx nodemon_ : RUNS the code directly
  -	_npm run dev_ : ALSO RUNS the code directly
  - _tsc --build_ : Builds the typescript project in JS → _node /dist/server.js_ : RUNS the JS code AFTER building it
-	Go to _http://localhost:5173_ → Login/Register normally using the credentials above OR create a new Student ID if required