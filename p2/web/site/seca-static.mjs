export function getHome(req, res) {
    res.sendFile('./public/index.html', {root: './web/site/'})
}