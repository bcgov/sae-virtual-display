var Greeting = React.createClass({
    render: function() {
      return (
        <p>Greet = {this.props.message}</p>
      );
    }
  });
  ReactDOM.render(
    <h1>React information with greeting <Greeting message="hello"/></h1>,
    document.getElementById('root')
);
