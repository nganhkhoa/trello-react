import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { Router } from '@reach/router';

import PopupState, {
  bindTrigger,
  bindPopover
} from 'material-ui-popup-state/index';
import deepPurple from '@material-ui/core/colors/deepPurple';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DoneIcon from '@material-ui/icons/Done';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import AddButton from '@/components/AddButton';
import AutoCompleteTextField from '@/components/AutoCompleteTextField';
import BasicLayout from '@/layouts/basic';
import CardDetail from '@/components/CardDetail';
import PrivateRoute from '@/components/PrivateRoute';
import ProtectedView from '@/components/ProtectedView';
import TrelloList from '@/components/List';

const styles = {
  // button: {
  //   margin: 1
  // },
  button: '',
  input: {
    display: 'none'
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    float: 'left',
    backgroundColor: deepPurple[500]
  },
  openFormButtonGroup: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 3,
    height: 36,
    width: 272,
    paddingLeft: 10
  },
  formButtonGroup: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center'
  },
  root: {
    flexGrow: 1,
    width: 1000
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: `1px`
  },
  bootstrapRoot: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf'
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
    }
  },
  margin: {
    margin: 1
  },
  username: {
    fontColor: 'brown',
    fontWeight: 'bold'
  }
};

const customStyle = {
  root: {
    flexGrow: 1
  },
  title: {
    color: 'brown'
  },
  boardContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  textField: {
    marginLeft: 5,
    marginRight: 5
  },
  button: {
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10
  },
  margin: { width: 130, marginLeft: 9, marginTop: -15 },
  purpleAvatar: {
    margin: 1,
    color: '#fff',
    float: 'left',
    backgroundColor: deepPurple[500]
  }
};

@connect(({ board, list, user, card }) => ({
  boardInfo: board.boardInfo,
  lists: list.lists,
  currentUser: user.user,
  showFormAddMem: board.showFormAddMem,
  cards: card.cards
}))
class Board extends React.Component {
  constructor(props) {
    super(props);
    const { boardInfo = {} } = props;
    const { modeView, name, background } = boardInfo;
    this.state = {
      boardName: name,
      background,
      modeView,
      isBackgroundEdit: false,
      isNameEdit: false,
      isMemEdit: false,
      isModeViewEdit: false,
      showFormAddMem: true
    };
  }

  componentWillReceiveProps(props) {
    const { boardInfo = {}, showFormAddMem } = props;
    const { modeView, name, background } = boardInfo;
    document.body.style.backgroundColor = background;
    this.setState({ boardName: name, background, modeView, showFormAddMem });
  }

  componentWillUnmount() {
    // reset defaut
    document.body.style.backgroundColor = 'white';
  }

  componentDidMount() {
    const { boardId, dispatch } = this.props;
    dispatch({
      type: 'board/fetchBoard',
      payload: {
        id: boardId
      }
    });
    dispatch({
      type: 'user/fetchCurrentUser',
      payload: {}
    });
  }

  onDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const {
      currentUser: { _id: userId }
    } = this.props;
    const { droppableId: sourceList } = source;
    const { droppableId: destList, index } = destination;
    this.props.dispatch({
      type: 'card/moveCardRequest',
      payload: {
        cardId: draggableId,
        newListId: destList,
        oldListId: sourceList,
        idUserMove: userId,
        order: index
      }
    });
  };

  changeState = kind => {
    if (kind === 'background')
      this.setState({
        isBackgroundEdit: true,
        isNameEdit: false,
        isMemEdit: false,
        isModeViewEdit: false,
        showFormAddMem: true
      });
    if (kind === 'name')
      this.setState({
        isBackgroundEdit: false,
        isNameEdit: true,
        isMemEdit: false,
        isModeViewEdit: false,
        showFormAddMem: true
      });
    if (kind === 'mem')
      this.setState({
        isBackgroundEdit: false,
        isNameEdit: false,
        isMemEdit: true,
        isModeViewEdit: false,
        showFormAddMem: true
      });
    if (kind === 'mode')
      this.setState({
        isBackgroundEdit: false,
        isNameEdit: false,
        isMemEdit: false,
        isModeViewEdit: true,
        showFormAddMem: true
      });
    // console.log(this.state);
  };

  clickLabel = e => {
    const btn = document.getElementsByName('label');
    for (var x of btn) x.innerHTML = '';
    e.target.innerHTML = `<i style={{float:'right'}}>✔</i>`;
    this.setState({ background: e.target.style.backgroundColor });
    document.body.style.backgroundColor = e.target.style.backgroundColor;
  };

  saveChange = kind => {
    const {
      dispatch,
      boardInfo: { _id: boardId },
      currentUser: { _id: ownerId }
    } = this.props;
    const { boardName, background } = this.state;
    let modeView;

    if (kind === 'modeViewTrue') {
      modeView = true;
      this.setState({ modeView: true });
    }
    if (kind === 'modeViewFalse') {
      modeView = false;
      this.setState({ modeView: false });
    }
    dispatch({
      type: 'board/editBoardRequest',
      payload: {
        boardId,
        ownerId,
        boardName,
        background,
        modeView
      }
    });
  };

  handleChange = e => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  };

  deleteMember = memberName => {
    const {
      dispatch,
      boardInfo: { _id: boardId },
      currentUser: { _id: idUserRemove }
    } = this.props;
    dispatch({
      type: 'board/removeMemberRequest',
      payload: {
        boardId,
        idUserRemove,
        memberName
      }
    });
  };

  render() {
    const mapColor = {
      white: 'blue',
      red: 'white',
      orange: 'green',
      yellow: 'blue',
      blue: 'white',
      green: 'white',
      gray: 'white'
    };
    const { lists = [], boardInfo = {} } = this.props;
    const { _id: boardId } = boardInfo;
    const members = boardInfo.members || [];
    const {
      showFormAddMem,
      boardName,
      isMemEdit,
      modeView,
      background,
      isModeViewEdit,
      isBackgroundEdit,
      isNameEdit
    } = this.state;

    return (
      <React.Fragment>
        <div>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {popupState => (
              <div>
                <div>
                  <Button
                    style={{
                      color: mapColor[background]
                        ? mapColor[background]
                        : 'white'
                    }}
                    onMouseUp={() => this.changeState('name')}
                    className={styles.button}
                    {...bindTrigger(popupState)}
                  >
                    <i className="material-icons"> table_chart </i>
                    <span style={{ fontSize: 25, marginLeft: 3 }}>
                      {' ' + boardName}
                    </span>
                  </Button>
                  <Button
                    onMouseUp={() => this.changeState('mode')}
                    style={{
                      color: mapColor[background]
                        ? mapColor[background]
                        : 'white'
                    }}
                    className={styles.button}
                    {...bindTrigger(popupState)}
                  >
                    <i className="material-icons"> lock </i>{' '}
                    {modeView === true ? ' Công khai' : ' Riêng tư'}
                  </Button>
                  <Button
                    style={{
                      color: mapColor[background]
                        ? mapColor[background]
                        : 'white'
                    }}
                    onMouseUp={() => this.changeState('background')}
                    className={styles.button}
                    {...bindTrigger(popupState)}
                  >
                    <i className="material-icons"> format_color_fill </i>{' '}
                    {' Màu nền'}{' '}
                  </Button>
                  <Button
                    style={{
                      color: mapColor[background]
                        ? mapColor[background]
                        : 'white'
                    }}
                    onMouseUp={() => this.changeState('mem')}
                    className={styles.button}
                    {...bindTrigger(popupState)}
                  >
                    <i className="material-icons"> people_outline </i> {' Mời'}
                  </Button>
                  <Button>
                    {members.map(
                      ({
                        _id: memberId,
                        username: memberUsername,
                        imageUrl: memberImageUrl = 'http://tinyurl.com/y34hpqbr'
                      }) => {
                        return (
                          <PopupState variant="popover" key={memberUsername}>
                            {popupState => (
                              <div>
                                <Tooltip
                                  title={memberUsername}
                                  placement="bottom"
                                >
                                  <Avatar
                                    {...bindTrigger(popupState)}
                                    key={memberUsername}
                                    src={memberImageUrl}
                                    style={customStyle.purpleAvatar}
                                  >
                                    {memberUsername.substring(0, 2)}
                                  </Avatar>
                                </Tooltip>
                                <Popover
                                  {...bindPopover(popupState)}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center'
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                  }}
                                >
                                  <Card
                                    style={{
                                      ...styles.cardContainer,
                                      width: 200
                                    }}
                                  >
                                    <CardContent>
                                      <Avatar
                                        src={memberImageUrl}
                                        style={customStyle.purpleAvatar}
                                      >
                                        {memberUsername.substring(0, 2)}
                                      </Avatar>
                                      <Typography style={customStyle.title}>
                                        {' '}
                                        {memberUsername}
                                      </Typography>
                                      <Button
                                        style={customStyle.button}
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          this.deleteMember(memberUsername)
                                        }
                                        id={memberId}
                                      >
                                        Gỡ
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </Popover>
                              </div>
                            )}
                          </PopupState>
                        );
                      }
                    )}
                  </Button>
                </div>
                {showFormAddMem === false ? null : (
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    <div style={customStyle.textField}>
                      {isNameEdit === false ? null : (
                        <TextField
                          margin="dense"
                          label="Tên bảng"
                          style={styles.textField}
                          value={boardName}
                          fullWidth
                          onChange={this.handleChange}
                          variant="outlined"
                          name="boardName"
                        />
                      )}
                      {isMemEdit === false ? null : (
                        <AutoCompleteTextField kind="board" />
                      )}

                      {isModeViewEdit === false ? null : (
                        <List>
                          <ListItem
                            button
                            onClick={() => {
                              this.saveChange('modeViewTrue');
                              popupState.close();
                            }}
                          >
                            <ListItemText inset primary="Công khai" />
                            <ListItemIcon>
                              {' '}
                              {modeView === true ? <DoneIcon /> : ' '}{' '}
                            </ListItemIcon>
                          </ListItem>
                          <ListItem
                            button
                            onClick={() => {
                              this.saveChange('modeViewFalse');
                              popupState.close();
                            }}
                          >
                            <ListItemText inset primary="Riêng tư" />
                            <ListItemIcon>
                              {' '}
                              {modeView === false ? <DoneIcon /> : ' '}{' '}
                            </ListItemIcon>
                          </ListItem>{' '}
                        </List>
                      )}
                      {isBackgroundEdit === false ? null : (
                        <div>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'red',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'red' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'yellow',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'yellow' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'orange',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'orange' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>{' '}
                          <br />
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'blue',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'blue' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'green',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'green' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: '#d27af4',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === '#d27af4' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>{' '}
                          <br />
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: '#1eedab',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === '#1eedab' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'gray',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'gray' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                          <Button
                            onClick={this.clickLabel}
                            name="label"
                            variant="contained"
                            style={{
                              backgroundColor: 'white',
                              height: 35,
                              width: 100
                            }}
                          >
                            {background === 'white' ? (
                              <i style={{ float: 'right' }}>✔</i>
                            ) : (
                              ' '
                            )}
                          </Button>
                        </div>
                      )}
                      {(isMemEdit || isModeViewEdit) === true ? null : (
                        <Button
                          style={customStyle.button}
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (isNameEdit && boardName !== '') {
                              this.saveChange('name');
                            } else if (isBackgroundEdit) {
                              this.saveChange('background');
                            } else {
                              return;
                            }
                            popupState.close();
                          }}
                        >
                          Lưu
                        </Button>
                      )}
                    </div>
                  </Popover>
                )}
              </div>
            )}
          </PopupState>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div>
            <div style={customStyle.boardContainer}>
              {lists.map(
                ({ name: listTitle, cards: listCards, _id: listId }) => (
                  <TrelloList
                    title={listTitle}
                    cards={listCards}
                    key={listId}
                    idList={listId}
                    idBoard={boardId}
                  />
                )
              )}
              <AddButton
                list
                color={mapColor[background] ? mapColor[background] : 'white'}
              />
              <CardDetail />
            </div>
          </div>
        </DragDropContext>
      </React.Fragment>
    );
  }
}

// boardId is pass through props,
// by PrivateRoute from Router
const BoardContainer = ({ boardId }) => (
  <ProtectedView allowedRole={['user', 'admin']}>
    <Board boardId={boardId} />
  </ProtectedView>
);

const BoardView = () => (
  <BasicLayout>
    <Router>
      <PrivateRoute path="/board/:boardId" component={BoardContainer} />
    </Router>
  </BasicLayout>
);

export default BoardView;
