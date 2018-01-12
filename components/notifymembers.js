


exports.notifymembers = (req, res, item, cb) => {
  console.log("MEMBERS NOTIFIED BY TEXT")
  console.log(item)
  res.json(item)
  cb()
}
