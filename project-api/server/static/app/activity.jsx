
class Activity extends React.Component {

  constructor(props) {
    super(props)
    this.state = { list : [] }
  }

  componentDidMount() {
    fetch('/admin/activity')
    .then(response => response.json())
    .then((jsonData) => {
      this.setState({list: jsonData})
    })
    .catch((error) => {
      console.error(error)
    });
  }

  render() {

    let rows = this.state.list.map( (r) => {
        let success = r.success ? (<span className="badge badge-pill badge-success">Success</span>) : (<span className="badge badge-pill badge-danger">Failed</span>)
        return (
          <tr>
            <th scope="row">{new Intl.DateTimeFormat('en-us', { 
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                hour12: true,
                minute: 'numeric',
                timeZone: 'America/Los_Angeles'
              }).format(new Date(r.ts))}</th>
            <td>{ r.actor }</td>
            <td>{ r.action }</td>
            <td>{ r.project }</td>
            <td>{success}<p>{ r.message }</p></td>
          </tr>
        )
    });

    return (

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Performed At</th>
            <th scope="col">By Actor</th>
            <th scope="col">Action</th>
            <th scope="col">Project</th>
            <th scope="col" width="30%">Result</th>
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
  <Activity/>,
  document.getElementById('activity_root')
);
