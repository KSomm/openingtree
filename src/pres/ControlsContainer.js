import React from 'react'
import PGNLoader from './loader/PGNLoader'
import SettingsView from './Settings'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col,Button } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faList, faCog, faChartBar } from '@fortawesome/free-solid-svg-icons'
import MovesList from './MovesList';
import {trackEvent} from '../app/Analytics'
import * as Constants from '../app/Constants'
import ReportControls from './ReportControls'
import {Modal, ModalHeader, ModalFooter} from 'reactstrap'
import {Table, TableRow, TableBody, TableCell} from '@material-ui/core'

export default class ControlsContainer extends React.Component {
    constructor(props){
      super(props)
      this.state = {
          activeTab:'user',
          activeGame:null
      }
      this.toggleModal = ()=>{
        this.setState({activeGame:null})
      }
    }
    

    launchGame(game) {
      if(game.url) {
          return (e) => {
              e.stopPropagation()
              window.open(game.url, '_blank');
              trackEvent(Constants.EVENT_CATEGORY_MOVES_LIST, "ViewGameExternal")
          }
      }
      return ((e) => {
        e.stopPropagation()
        this.setState({activeGame:game})
      })
    }

    toggle(tab) {
        if(this.state.activeTab !== tab) {
            this.setState({activeTab:tab})
            trackEvent(Constants.EVENT_CATEGORY_CONTROLS,`activeTab:${tab}`)
        }
    }
    switchToUserTab() {
      this.toggle('user')
    }
    switchToMovesTab() {
      this.toggle('moves')
    }

    render(){
        return <div>
              <Modal isOpen={this.state.activeGame} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>Game details</ModalHeader>
              {!this.state.activeGame?null:
              <Table>
                
                <TableBody>
                  {
                    Object.entries(this.state.activeGame.headers).map((entry)=>!entry[1]?null:<TableRow className="performanceRatingRow">
                        <TableCell className="performanceRatingRow">{entry[0]}</TableCell>
                        <TableCell className="performanceRatingRow">{entry[1]}</TableCell>
                    </TableRow>
                    )}
                  
                </TableBody>
              </Table>
              }
              <ModalFooter>
          <Button color="secondary" onClick={this.toggleModal}>Done</Button>
        </ModalFooter>
              </Modal>
            <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === 'user' })}
            onClick={() => { this.toggle('user'); }}
          >
            <FontAwesomeIcon icon={faUser} /> {this.state.activeTab === 'user'?"User":""}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === 'moves' })}
            onClick={() => { this.toggle('moves'); }}
          >
            <FontAwesomeIcon icon={faList} /> {this.state.activeTab === 'moves'?"Moves":""}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === 'report' })}
            onClick={() => { this.toggle('report'); }}
          >
            <FontAwesomeIcon icon={faChartBar} /> {this.state.activeTab === 'report'?"Report":""}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === 'settings' })}
            onClick={() => { this.toggle('settings'); }}
          >
            <FontAwesomeIcon icon={faCog} /> {this.state.activeTab === 'settings'?"Controls":""}
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="user">
            <PGNLoader 
              switchToMovesTab={this.switchToMovesTab.bind(this)} 
              clear = {this.props.clear} 
              gamesProcessed = {this.props.gamesProcessed} 
              settings = {this.props.settings} 
              onChange = {this.props.settingsChange} 
              notify = {this.props.updateProcessedGames}
              showError = {this.props.showError}
              showInfo = {this.props.showInfo}
              setDownloading = {this.props.setDownloading}
              isDownloading = {this.props.isDownloading}
              openingGraph={this.props.openingGraph}
              importCallback={this.props.importCallback}
              variant={this.props.variant}
              variantChange={this.props.variantChange}
              />
            </TabPane>
        <TabPane tabId="moves">
            <MovesList 
              switchToUserTab={this.switchToUserTab.bind(this)} 
              movesToShow={this.props.movesToShow} 
              gameResults={this.props.gameResults}
              onMove={this.props.onMove}
              settings={this.props.settings}
              turnColor={this.props.turnColor}
              settingsChange={this.props.settingsChange}
              launchGame = {this.launchGame.bind(this)}
              />
        </TabPane>
        <TabPane tabId="report">
          <ReportControls fen={this.props.fen} simplifiedView = {false}
            moveDetails = {this.props.openingGraph.getDetailsForFen(this.props.fen)}
            launchGame={this.launchGame.bind(this)} settings={this.props.settings}
            switchToUserTab={this.switchToUserTab.bind(this)} 
            isOpen = {this.state.activeTab === "report"}
            showInfo = {this.props.showInfo}/>
        </TabPane>
        <TabPane tabId="settings">
          <Row>
            <Col sm="6">
            <SettingsView fen={this.props.fen} settings={this.props.settings} isOpen = {true} clear = {this.props.clear} reset = {this.props.reset} onChange = {this.props.settingsChange}/>
            
            </Col>
          </Row>
        </TabPane>
      </TabContent>
        </div>
    }
}