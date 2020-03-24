
class Registration extends React.Component {

  constructor(props) {
    super(props)
    this.state = { list : [] }
  }

  componentDidMount() {
    fetch('/selfserve/groups')
    .then(response => response.json())
    .then((jsonData) => {
        console.log(JSON.stringify(jsonData));
      this.setState({list: jsonData})
    })
    .catch((error) => {
      console.error(error)
    });
  }

  render() {

    let rows = this.state.list.map( (r) => {
        return (
          <tr>
            <td>{ r }</td>
          </tr>
        )
    });

    if (this.state.list.length == 0) {
        rows = (
            <tr><td>No projects assigned</td></tr>
        )
    }
    return (

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Groups</th>
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
  <Registration/>,
  document.getElementById('registration_root')
);
