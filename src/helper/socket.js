let users = []

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.id === userId)
  if (user && user.socketId === socketId) return users

  if (user && user.socketId !== socketId) await removeUser(user.socketId)

  const newUser = { userId, socketId }
  users.push(newUser)
  return users
}

const removeUser = (socketId) =>
  (users = users.filter((user) => user.socketId !== socketId))

const findConnectedUser = (userId) =>
  users.find((user) => user.userId === userId)

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', async ({ userId }) => {
      const users = await addUser(userId, socket.id)

      console.log('USER JOINING')

      setInterval(() => {
        socket.emit('connectedUsers', {
          users: users.filter((user) => user.id !== userId),
        })
      }, 10000)
    })

    socket.on('post', async ({ description, postId, sender, receiverId }) => {
      if (sender && receiverId !== sender.userId) {
        const receiverSocket = findConnectedUser(receiverId)
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit('notificationReceived', {
            description,
            postId,
            senderName: sender.displayName,
            receiverId,
            senderId: sender.userId,
            senderImage: sender.photoURL,
            createdAt: new Date().toISOString(),
          })
        }
      }
    })

    socket.on(
      'comment',
      async ({ description, postId, sender, receiver, commentContent }) => {
        if (sender && receiver.postedBy._id !== sender.userId) {
          const receiverSocket = findConnectedUser(receiver.postedBy._id)

          if (receiverSocket) {
            io.to(receiverSocket.socketId).emit('notificationReceived', {
              description,
              postId,
              senderName: sender.displayName,
              receiverName: receiver.postedBy.fullName,
              receiverId: receiver.postedBy._id,
              senderId: sender.userId,
              senderImage: sender.photoURL,
              commentContent,
              createdAt: new Date().toISOString(),
            })
          }
        }
      }
    )

    socket.on('like', async ({ description, postId, sender, receiver }) => {
      if (sender && receiver._id !== sender.userId) {
        const receiverSocket = findConnectedUser(receiver._id)
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit('notificationReceived', {
            description,
            postId,
            senderId: sender.userId,
            senderName: sender.displayName,
            receiverName: receiver.fullName,
            receiverId: receiver._id,
            senderImage: sender.photoURL,
            createdAt: new Date().toISOString(),
          })
        }
      }
    })

    socket.on('disconnect', () => {
      removeUser(socket.id)
    })
  })
}

module.exports = socketHandlers
