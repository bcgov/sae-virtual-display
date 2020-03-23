
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

    let rows = this.state.data['projects'].map( (project) => {
        return (
          <tr>
            <td>{ project }</td>
          </tr>
        )
    });

    return (
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Project</th>
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
