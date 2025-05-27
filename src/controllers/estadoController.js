
const getSuccess = async (req, res) => {
    res.json({ exito: true });
};

const getCancel = async (req, res) => {
    res.json({ exito: false });
};

module.exports = {
    getSuccess,
    getCancel
};
