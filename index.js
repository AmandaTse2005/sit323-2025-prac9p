const express = require("express");
const app = express();

app.use(express.json());

const {MongoClient} = require("mongodb");
const {ObjectId} = require("mongodb");

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const uri = "mongodb://" + username + ":" + password + "@" + host + ":" + port + "/" + dbName + "?authSource=admin";

let db;
MongoClient.connect(uri)
  .then(client => {
    console.log("Connected to MongoDB!");
    db = client.db(dbName);
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const createCalculation = async (operation, num1, num2, result) => {
    const calculation = {operation, num1, num2, result, createdAt: new Date()};
    return await db.collection("calculations").insertOne(calculation);
};

const getAllCalculations = async () => {
    return await db.collection("calculations").find().toArray();
};

const updateCalculation = async (id, updatedFields) => {
    return await db.collection("calculations").updateOne(
        {_id: new ObjectId(id)},
        {$set: updatedFields}
    );
};

const deleteCalculation = async (id) => {
    return await db.collection("calculations").deleteOne(
        {_id: new ObjectId(id)}
    );
};

const addition = (num1, num2) => {
    return num1 + num2;
}

app.get("/addition", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        if(isNaN(num2)) {
            throw new Error("num2 is not a valid number");
        }

        const result = addition(num1, num2);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

const subtraction = (num1, num2) => {
    return num1 - num2;
}

app.get("/subtraction", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        if(isNaN(num2)) {
            throw new Error("num2 is not a valid number");
        }

        const result = subtraction(num1, num2);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

const multiplication = (num1, num2) => {
    return num1 * num2;
}

app.get("/multiplication", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        if(isNaN(num2)) {
            throw new Error("num2 is not a valid number");
        }

        const result = multiplication(num1, num2);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

const division = (num1, num2) => {
    if(num2 === 0) {
        throw new Error("Cannot divide by zero");
    }
    return num1 / num2;
}

app.get("/division", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        if(isNaN(num2)) {
            throw new Error("num2 is not a valid number");
        }

        const result = division(num1, num2);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

const exponentiation = (num1, num2) => {
    return num1 ** num2;
}

app.get("/exponentiation", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        if(isNaN(num2)) {
            throw new Error("num2 is not a valid number");
        }

        const result = exponentiation(num1, num2);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

const squareroot = (num1) => {
    if(num1 < 0) {
        throw new Error("Cannot calculate the square root of a negative number");
    }
    return Math.sqrt(num1);
}

app.get("/squareroot", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        const result = squareroot(num1);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

const modulo = (num1, num2) => {
    if(num2 === 0) {
        throw new Error("Cannot divide by zero");
    }
    return num1 % num2;
}

app.get("/modulo", (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);

        if(isNaN(num1)) {
            throw new Error("num1 is not a valid number");
        }

        if(isNaN(num2)) {
            throw new Error("num2 is not a valid number");
        }

        const result = modulo(num1, num2);
        res.status(200).json({Answer: result});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({msg:error.toString()})
    }
});

app.post("/calculations", async (req, res) => {
    try {
        const {operation, num1, num2, result} = req.body;
        const newCalculation = {operation, num1, num2, result, createdAt: new Date()};
        const insertResult = await db.collection("calculations").insertOne(newCalculation);
        res.status(201).json({message: "Calculation Created!", id: insertResult.insertedId});
    }
    catch (error) {
        res.status(500).json({msg: error.message});
    }
});

app.get("/calculations", async (req, res) => {
    try {
        const calculations = await getAllCalculations();
        res.status(200).json(calculations);
    }
    catch (error) {
        res.status(500).json({msg:error.message});
    }
});

app.put("/calculations/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {operation, num1, num2, result} = req.body;
        const updatedCalculation = {operation, num1, num2, result};
        const updateResult = await updateCalculation(id, updatedCalculation);
        if (updateResult.matchedCount > 0) {
            res.status(200).json({message: "Calculation Updated!"});
        } else {
            res.status(404).json({message: "Calculation Not Found!"});
        }
    }
    catch (error) {
        res.status(500).json({msg:error.message});
    }
});

app.delete("/calculations/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteResult = await deleteCalculation(id);
        if (deleteResult.deletedCount > 0) {
            res.status(200).json({message: "Calculation Deleted!"});
        } else {
            res.status(404).json({message: "Calculation Not Found!"});
        }
    }
    catch (error) {
        res.status(500).json({msg: error.message});
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})


//Detailed Documentation:
//1. Imported the required "express" module and created an Express application.
//2. Configured the Express application to use the json middleware.
//3. Imported the "MongoClient" and "ObjectId" from the "mongodb" module.
//4. Set up environment variables for the MongoDB username, password, host, port and database name.
//5. Constructed the MongoDB URI using the environment variables for secure database connection.
//6. Connected to the MongoDB database and logged success or failure, exiting on connection error.
//7. A function that performs the creation of a new calculation document and inserts it into the MongoDB "calculations" collection.
//8. A function that performs the retrieval of all calculation documents from the MongoDB "calculations" collection.
//9. A function that performs the update of a specific calculation document from the MongoDB "calculations" collection using its ID.
//10. A function that performs the deletion of a specific calculation document from the MongoDB "calculations" collection using its ID.
//11. A function that performs the API endpoint for addition.
//12. Served the addition requests to validate inputs, perform addition, send responses and handle errors.
//13. A function that performs the API endpoint for subtraction.
//14. Served the subtraction requests to validate inputs, perform subtraction, send responses and handle errors.
//15. A function that performs the API endpoint for multiplication.
//16. Served the multiplication requests to validate inputs, perform multiplication, send responses and handle errors.
//17. A function that performs the API endpoint for division.
//18. Served the division requests to validate inputs, perform division, send responses and handle errors.
//19. A function that performs the API endpoint for exponentiation.
//20. Served the exponentiation requests to validate inputs, perform exponentiation, send responses and handle errors.
//21. A function that performs the API endpoint for square root.
//22. Served the square root requests to validate inputs, perform square root, send responses and handle errors.
//23. A function that performs the API endpoint for modulo.
//24. Served the modulo requests to validate inputs, perform modulo, send responses and handle errors.
//25. Served the POST request at "/calculations" to insert new calculation records into the "calculations" collection.
//26. Served the GET request at "/calculations" to retrieve all calculation records from the "calculations" collection.
//27. Served the PUT request at "/calculations/:id" to update a specific calculation record by ID.
//28. Served the DELETE request at "/calculations/:id" to delete a specific calculation record by ID.
//29. For starting the server.