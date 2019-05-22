import React from 'react';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import classNames from 'classnames';
import dateFormat from 'dateformat';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Header from '@/layouts/header';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Welcome from '@/components/Welcome';

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
});

@connect(({ user }) => ({
  user: user.user,
  board: user.board
}))
@withStyles(styles)
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      openDiaglogRemove: false,
      isLogin: user.username !== undefined
    };
  }

  componentWillReceiveProps(props) {
    const { user } = this.props;
    if (user.username) this.setState({ isLogin: true });
    else this.setState({ isLogin: false });
  }

  toLogin = () => {
    navigate(`/auth/login`);
  };

  toSignUp = () => {
    navigate(`/auth/signUp`);
  };

  onSubmit = boardId => {
    navigate(`/board/${boardId}`);
  };

  handleClickOpen = idPrepareRemove => {
    this.setState({ openDiaglogRemove: true, idPrepareRemove });
  };

  handleClose = () => {
    this.setState({ openDiaglogRemove: false });
  };

  onDelete = boardId => {
    const {
      dispatch,
      user: { _id: ownerId }
    } = this.props;
    dispatch({
      type: 'board/deleteBoardRequest',
      payload: { boardId, ownerId }
    });
    this.setState({ openDiaglogRemove: false });
  };

  render() {
    const { classes, board = [] } = this.props;
    const { isLogin, openDiaglogRemove, idPrepareRemove } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <div className={classes.heroUnit}>
            {isLogin === false ? <Welcome /> : null}{' '}
          </div>
          {this.props.children !== undefined ? (
            this.props.children
          ) : (
            <div className={classNames(classes.layout, classes.cardGrid)}>
              <div className={classNames(classes.layout, classes.cardGrid)}>
                <div className={classNames(classes.layout, classes.cardGrid)}>
                  <Grid container spacing={40}>
                    {board.map(
                      ({
                        _id: boardId,
                        background,
                        dateCreated,
                        list,
                        members,
                        name,
                        modelView,
                        ownerId
                      }) => (
                        <Grid item key={boardId} sm={6} md={4} lg={3}>
                          <Card className={classes.card}>
                            <CardHeader
                              action={
                                <IconButton
                                  onClick={() => this.handleClickOpen(boardId)}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              }
                              title={name}
                              subheader={dateFormat(
                                new Date(dateCreated),
                                'dddd, mmmm dS, yyyy'
                              )}
                              style={{ backgroundColor: '#e0ddd0' }}
                            />

                            <CardMedia
                              className={classes.cardMedia}
                              image="https://design.trello.com/img/mascots/mascots-graphic-1@2x.png"
                              title="Image title"
                              onClick={() => this.onSubmit(boardId)}
                            />
                            <CardContent
                              className={classes.cardContent}
                              style={{ backgroundColor: '#e0ddd0' }}
                            >
                              <Typography style={{ fontSize: 30 }}>
                                <i
                                  className="material-icons"
                                  style={{ fontSize: 40 }}
                                >
                                  person_outline
                                </i>{' '}
                                {members.length}{' '}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    )}
                  </Grid>
                </div>
              </div>
            </div>
          )}
          <Dialog open={openDiaglogRemove} onClose={this.handleClose}>
            <DialogTitle>Remove board</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to remove this board pernamently?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  this.onDelete(idPrepareRemove);
                }}
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </main>

        {/* Footer */}
        {/* <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Tháng 5 - 2019
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            Thực tập công nghệ phần mềm
          </Typography>
        </footer> */}
        {/* End footer */}
      </React.Fragment>
    );
  }
}

BasicLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default BasicLayout;
