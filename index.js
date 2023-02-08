import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
const __direname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__direname, './config/.env') })
import express from 'express'
import morgan from 'morgan'
import * as indexRouter from './src/module/index.router.js'
const app = express()
import connection from './DB/connection.js'
import { globalError } from './src/services/asyncHandler.js'
import cors  from "cors"
var corsOption = {
    origin: "*",
    optionsSuccessStatus: 200
}
app.use(cors("*"))
const port = process.env.PORT
const baseUrl = process.env.baseUrl
app.use(express.json())
// app.use(morgan())
app.use('/auth', indexRouter.authRouter)
app.use('/category', indexRouter.categoryRouter)
app.use('/subCategory', indexRouter.subCategoryRouter)
app.use('/brand', indexRouter.brandRouter)
app.use('/product', indexRouter.productRouter)
app.use('/wishlist', indexRouter.wishlistRouter)
app.use('/coupon', indexRouter.couponRouter)
app.use('/cart', indexRouter.cartRouter)
app.use('/store', indexRouter.storeRouter)
app.use('/chat', indexRouter.chatRouter)
app.get('/', (req, res) => res.send('coupon module!'))
app.use('*', (req, res, next) => {
    res.send("In-valid Route pls check url or method")
})
app.use(globalError)
connection()
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
import * as socket from'./common/socket.js'
import userModel from './DB/model/user.model.js'
import storesModel from './DB/model/store.model.js'
const io = socket.init(server)
io.on("connection",(socket)=>{
    console.log("connection");
    socket.on('updateSocketId', async(_id)=>{
        if (_id) {
            const updatedUser = await userModel.findByIdAndUpdate({_id},{socketID:socket.id},{new:true})
        }
    })
    socket.on('updateStoreSocketId', async(_id)=>{
        if (_id) {
            const updatedStore = await storesModel.findByIdAndUpdate({_id},{socketID:socket.id},{new:true})
        }
    })
    socket.on('sendMessage', async (data) => {
        console.log(data.socketID);
        socket.to(data.socketID).emit('resevMessage', data)
    })
})