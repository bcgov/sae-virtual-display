
class ProjectConfig extends React.Component {

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

    return (
    <div>
      <h3>Keycloak</h3>
      <pre>{JSON.stringify(this.state.data.keycloak, null, 3)}</pre>
      <h3>Vault</h3>
      <pre>{JSON.stringify(this.state.data.vault, null, 3)}</pre>
      <h3>Minio</h3>
      <pre>{JSON.stringify(this.state.data.minio, null, 3)}</pre>
    </div>
    );
  }
}

ReactDOM.render(
  <ProjectConfig/>,
  document.getElementById('config_root')
);
