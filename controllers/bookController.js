const books= require('../models/bookModel')
const Stripe = require('stripe')(process.env.stripeKey);

//ADD BOOK
exports.addBook=async(req,res)=>{
    console.log("inside the book");
    console.log(req.body);
    console.log(req.files);
    
    
    const { title,author,noofpages,imageUrl,price,dprice,abstract,publisher,language,isbn,category} =req.body
    const userMail = req.payload
    const uploadedImages = []
    req.files.map(item=>uploadedImages.push(item.filename))
    console.log(title,author,noofpages,imageUrl,price,dprice,abstract,publisher,language,isbn,category,userMail,uploadedImages);

    const existingBook = await books.findOne({title,userMail})
    if(existingBook){
        res.status(401).json({message:"Book already existing..."})
    }
    else{
        const newBook = books ({
            title,author,noofpages,imageUrl,price,dprice,abstract,publisher,language,isbn,category,userMail,uploadedImages
        })
        await newBook.save()
         res.status(200).json({message: "Book added successfully..",newBook})
    } // res.send("Request received")
    
}

  //View Books -GET
    exports.viewBooks = async(req,res)=>{
        
        console.log("Inside View Book");
        console.log(req.query); //{?search=The 48 Laws of Power}
        searchKey = req.query.search
        try{
            const query = {
                title:{
                    $regex:searchKey,
                    $options:"i"
                }
            }
            const viewBook = await books.find(query)
            res.status(200).json({message:"All Books Fetched...",viewBook})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }
        
    }

    //View 4 Home Books
    exports.homeBooks = async(req,res)=>{
        console.log("Inside Home Book");
        try{
            const homeBook = await books.find().limit(4).sort({"_id":-1})
            res.status(200).json({message:"All Books Fetched...",homeBook})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }
        
    }

     //Get A Book
    exports.getABook = async(req,res)=>{
        console.log("Inside get a Book");
        const {id} = req.params

        try{
            const book = await books.findOne({_id:id})
            res.status(200).json({message:"Book Fetched...",book})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }   
    }

    //Get All Book
    exports.getAllBooks = async(req,res)=>{
        console.log("Inside get all Books");

        try{
            const book = await books.find()
            res.status(200).json({message:"Book Fetched...",book})

        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }
        
    }

         //Delete A Book
    exports.deleteABook = async(req,res)=>{
        console.log("Inside delete a Book");
        const {id} = req.params

        try{
            const book = await books.deleteOne({_id:id})
            res.status(200).json({message:"Book deleted...",book})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }   
    }

    //Approve A Book
    exports.approveABook = async(req,res)=>{
        console.log("Inside approve a Book");
        const {id} = req.params

        try{
            const book = await books.findById({_id:id})
            console.log(book);
            if(!book){
                res.status(404).json({message:"Book Not Found"})
            }
            
            book.status="Approved"
            await book.save()

            res.status(200).json({message:"Book updated...",book})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }   
    }

    //Reject A Book
    exports.rejectABook = async(req,res)=>{
        console.log("Inside reject a Book");
        const {id} = req.params

        try{
            const book = await books.findById({_id:id})
            console.log(book);
            if(!book){
                res.status(404).json({message:"Book Not Found"})
            } 
            book.status="Rejected"
            await book.save()
            res.status(200).json({message:"Book updated...",book})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }   
    }

    //Make Payment

     exports.makePayment = async(req,res)=>{
        console.log("Inside Payment");
        const email = req.payload
        const {bookDetails} = req.body


        try{
            const bookPayment = await books.findByIdAndUpdate(bookDetails.id,{
                        title:bookDetails.title,
                        author:bookDetails.author,
                        noofpages:bookDetails.noofpages,
                        imageUrl:bookDetails.imageUrl,
                        price:bookDetails.price,
                        dprice:bookDetails.dprice,
                        abstract:bookDetails.abstract,
                        publisher:bookDetails.publisher,
                        language:bookDetails.language,
                        isbn:bookDetails.isbn,
                        category:bookDetails.category,
                        userMail:bookDetails.userMail,
                        uploadedImages:bookDetails.uploadedImages,
                        status:"Sold",
                        brought:email

        },
        {new :true}
    );
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookDetails.title,
            description: `${bookDetails.author} | ${bookDetails.publisher}`,
            images: [bookDetails.imageUrl],
            metadata: {
              title: bookDetails.title,
              author: bookDetails.author,
              noofpages: bookDetails.noofpages,
              imageUrl: bookDetails.imageUrl,
              price: bookDetails.price,
              dprice: bookDetails.dprice,
              abstract: bookDetails.abstract,
              publisher: bookDetails.publisher,
              language: bookDetails.language,
              isbn: bookDetails.isbn,
              category: bookDetails.category,
              uploadedImages: bookDetails.uploadedImages,
              status: "Sold",
              userMail: bookDetails.userMail,
              brought: email,
            },
          },
          unit_amount: Math.round(Number(bookDetails.dprice) * 100),
        },
        quantity: 1,
      },
    ];
    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-error",
      line_items,
      mode: "payment",
    });
    console.log(session)

        res.status(200).json({message:"Payment success...",session})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }   
    }