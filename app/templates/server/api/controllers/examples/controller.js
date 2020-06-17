import ExamplesService from '../../services/examples.service';

export class Controller {
  async all(req, res) {
    const r = await ExamplesService.all();
    res.json(r);
  }

  async byId(req, res) {
    const r = await ExamplesService.byId(req.params.id);
    if (r) {
      res.json(r)
    } else {
      res.status(404).end()
    }
  }

  async create(req, res) {
    ExamplesService
        .create(req.body.name)
        .then(r => res
            .status(201)
            .location(`<%= apiRoot %>/examples/${r.id}`)
            .json(r));
  }
}

export default new Controller();
