
export class Controller {
  ping(req, res) {
    res.json({ ping: '✔' });
  }
}

export default new Controller();
