
class Projects extends React.Component {

  constructor(props) {
    super(props)
    this.state = { data : {projects: []} }
  }

  componentDidMount() {
    fetch('/admin/projects')
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({data: jsonData})
    })
    .catch((error) => {
      console.error(error)
    });
  }

  render() {

    let membership = this.state.data['membership'];
    let rows = this.state.data['projects'].map( (project, index) => {
        let members = membership[index].map(m => (
            <li><span style={{width:"200px",display:"inline-block"}}>{m.username}</span> {m.email}</li>
        ));
        return (
          <tr>
            <td>{ project }</td>
            <td><ul>{ members }</ul></td>
          </tr>
        )
    });

    return (
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Membership</th>
          </tr>
        </thead>
        <tbody>
           {rows}
        </tbody>
      </table>
    );
  }
}

ReactDOM.render(
  <Projects/>,
  document.getElementById('projects_root')
);
