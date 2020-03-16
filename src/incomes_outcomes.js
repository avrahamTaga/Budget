function handleGetArray(res, array) {
    res.send(array);
}
module.exports.handleGetArray = handleGetArray;

function handleDeleteData(req, res, array) {
    let id = req.params.id
    // --- check if income exist , if not send 404
    let index = array.findIndex(data => data.id == id);
    // --- in case delete is success remove from incomes array
    if (index == -1) {
        res.sendStatus(404);
    } else {
        array.splice(index, 1);
        res.status(200).send(array);
    }
}
module.exports.handleDeleteData = handleDeleteData;

function handleCreateData(req, res, array, idCounter) {
    // --- retrive body from request
    let data = req.body;
    data.id = idCounter;
    array.push(data);
    res.status(201).send(data);
}
module.exports.handleCreateData = handleCreateData;