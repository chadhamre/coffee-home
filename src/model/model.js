import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
// import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import './model.css';
import styles from './style.json'
import queryString  from 'query-string'
import { connect } from 'react-redux'
import Loader from './../load-page/load-page.js'
import { modelData } from './../action/actions'
import Yield from './../graphs/coffee-yeild.js'
import './model.css'

const mapDispatchTo = (dispatch) => ({
  modelDataDisp: (dt) => dispatch(modelData(dt))
})

const mapStateData = (state) => ({
  modelData: state.modelData,
  userData: state.userDataInput,
})

class Model extends Component {

  state = {
    loading: false,
  }

  postCoordsModel(coords){
    this.setState({ loading: true });
    fetch('http://localhost:8080/model-data', {
      body: JSON.stringify({xcoord: coords.lng, ycoord: coords.lat}),
      headers: {'Content-Type' : 'application/json'},
      method: 'POST',
    })
    .then(resp => resp.json())
    .then(r => {
      this.props.modelDataDisp(r)
      this.setState({ loading: false });
    })
  }
  componentDidMount(){
    this.postCoordsModel(queryString.parse(this.props.location.search))
  }

  render() {
    console.log("this props model", this.props.userData)
    if(!this.state.loading){
    return (
        <MuiThemeProvider>
        <div>
          <header>
            <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet"/>
          </header>
          <AppBar title="the coffee app" style={styles.appbarStyle} iconElementLeft={<div className="header-logo"/>}/>
          <div className="modelData-body">
            <Paper className="model-frame" zDepth={3}>
              <div className="yields-header">
                <div className="yield-title-container">
                  <div className="yield-title">Y I E L D S</div>
                </div>
                <div className="yield-image-container">
                  <div className="yield-image"></div>
                </div>
              </div>

              <div className="yield-box">
                <div className="yield-info-header">
                  <div className="yield-location">Predicted coffee yields for: </div>
                  <div className="yield-coord-box">
                    <div className="latitude-box">
                      <label/>latitude:
                      <div className="coord-values">{Math.round(queryString.parse(this.props.location.search).lat*1000)/1000} </div>
                    </div>
                    <div className="longitude-box">
                      <label/>longitude:
                      <div className="coord-values">{Math.round(queryString.parse(this.props.location.search).lng*1000)/1000} </div>
                    </div>
                  </div>
                </div>
                <div className="yield-info-graph">
                  <div className="yield-graph-a">
                  <Yield data={this.props.modelData} width={350} height={180} yMax={this.props.modelData[5].yield*1.161}/>
                  </div>
                  <div className="yield-graph-b">
                    <div>
                      Shade: {this.props.userData.shadeValue}
                    </div>
                    <div>
                      Yield: {this.props.userData.yieldValue/10}
                    </div>
                    <div>
                      Irrigation: {this.props.userData.irrigationValue ? "irrigated" : "no irrigation"}
                    </div>
                    <div>
                      Slope: {this.props.userData.slopeValue}
                    </div>
                  </div>
                </div>
                <div className="yield-info-explanation"></div>
              </div>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
      );
    }
   else {
      return (<Loader/>)
    }
  }
  }


//
export default connect(mapStateData, mapDispatchTo)(Model);;
