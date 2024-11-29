const jsonServer = require('json-server')
const multer = require('multer')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Storage configuration for multer (image upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')  // Store images in the 'public/images' folder
  },
  filename: function (req, file, cb) {
    let date = new Date()
    let imageFilename = date.getTime() + "_" + file.originalname
    req.body.imageFilename = imageFilename  // Save the image filename in the request body
    cb(null, imageFilename)  // Save the image with the unique filename
  }
})

// Set up multer to handle file uploads (accept any files)
const bodyParser = multer({ storage: storage }).any()

server.use(bodyParser)

// POST route for creating employees with validation
server.post("/employees", (req, res, next) => {
  let date = new Date()
  req.body.createdAt = date.toISOString()

  // Optional: convert fields to correct types if needed
  if (req.body.price) {
    req.body.price = Number(req.body.price)
  }

  // Initialize error tracking
  let hasErrors = false
  let errors = {}

  // Validation for each field
  if (req.body.name.length < 2) {
    hasErrors = true
    errors.name = "The name must be at least 2 characters"
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(req.body.email)) {
    hasErrors = true
    errors.email = "A valid email is required"
  }
  if (req.body.mobileNo && req.body.mobileNo.length < 10) {
    hasErrors = true
    errors.mobileNo = "Mobile number must be at least 10 digits"
  }
  if (req.body.designation.length < 2) {
    hasErrors = true
    errors.designation = "Designation must be at least 2 characters"
  }
  if (!['Male', 'Female'].includes(req.body.gender)) {
    hasErrors = true
    errors.gender = "Gender must be 'Male' or 'Female'"
  }
  if (!req.body.courses || req.body.courses.length === 0) {
    hasErrors = true
    errors.courses = "At least one course must be selected"
  }
  if (!req.body.imageFilename) {
    hasErrors = true
    errors.image = "Image is required"
  }

  if (hasErrors) {
    return res.status(400).json(errors)
  }

  // Proceed with storing the valid employee data
  next()
})

// POST route for creating products with validation (keep existing logic)


// Use the JSON Server router to handle database actions
server.use(router)

// Start the JSON server on port 4000
server.listen(4000, () => {
  console.log('JSON Server is running')
})
