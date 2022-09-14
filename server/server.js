const PROTO_PATH = "./restaurant.proto"

var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")

const { v4: uuidv4 } = require("uuid")
const { connectDB } = require("./configs/db")
const { Menu } = require("./models/Menu")

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
})

var restaurantProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()

server.addService(restaurantProto.RestaurantService.service, {
  getAllMenu: async (_, callback) => {
    try {
      const menu = await Menu.find()
      callback(null, { menu })
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err,
      })
    }
  },
  get: async (call, callback) => {
    try {
      const menuItem = await Menu.findById(call.request.id)
      if (menuItem !== null) {
        callback(null, menuItem)
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not Found",
        })
      }
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err,
      })
    }
  },
  insert: async (call, callback) => {
    const menuItem = new Menu({ ...call.request, _id: uuidv4() })
    try {
      const newMenuItem = await menuItem.save()
      callback(null, newMenuItem)
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err,
      })
    }
  },
  update: async (call, callback) => {
    try {
      const updatedMenuItem = await Menu.findOneAndUpdate(
        { _id: call.request.id },
        { name: call.request.name, price: call.request.price }
      )
      if (updatedMenuItem !== null) {
        callback(null, updatedMenuItem)
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not Found",
        })
      }
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err,
      })
    }
  },
  remove: async (call, callback) => {
    try {
      const deletedMenuItem = await Menu.findOneAndDelete({
        _id: call.request.id,
      })
      if (deletedMenuItem !== null) {
        callback(null, deletedMenuItem)
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not Found",
        })
      }
    } catch (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: err,
      })
    }
  },
})

const main = () => {
  connectDB()
  server.bindAsync(
    "127.0.0.1:30043",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("Server running at http://127.0.0.1:30043")
      server.start()
    }
  )
}

main()
