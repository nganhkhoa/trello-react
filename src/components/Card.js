import React from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

@connect(state => ({}))
class TrelloCard extends React.Component {
  onClick = e => {
    const { dispatch, card: cardId } = this.props;
    dispatch({
      type: 'card/getCardRequest', // toggle modal detail card
      payload: { cardId }
    });
    dispatch({
      type: 'logCard/fetchLogOfCard',
      payload: { cardId }
    });
    dispatch({
      type: 'comment/fetchCommentOfCard',
      payload: { cardId }
    });
  };

  render() {
    const styles = {
      cardContainer: {
        marginBottom: 8
      },
      title: {
        color: 'brown',
        fontSize: 18,
        fontWeight: 'bold'
      },
      margin: {
        margin: 2,
        marginRight: 3
      }
    };

    const {
      card: {
        _id: cardId,
        title = '',
        members = [],
        comments = [],
        labels = [],
        archived = false,
        order
      },
      index
    } = this.props;

    return (
      <Draggable draggableId={String(cardId)} index={index}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card style={styles.cardContainer} onClick={this.onClick}>
              <CardContent>
                <Typography gutterBottom style={styles.title}>
                  {`${order}. ${title}`}
                  {archived ? (
                    <i className="material-icons" style={{ fontSize: 20 }}>
                      {' '}
                      done{' '}
                    </i>
                  ) : null}
                </Typography>

                <Typography gutterBottom>
                  <i className="material-icons" style={{ fontSize: 20 }}>
                    {' '}
                    person_outline{' '}
                  </i>{' '}
                  {members.length}{' '}
                  <i className="material-icons" style={{ fontSize: 20 }}>
                    {' '}
                    chat_bubble_outline{' '}
                  </i>{' '}
                  {comments.length}
                </Typography>
                {labels.map(({ labelColor }) => {
                  return (
                    <Button
                      key={labelColor}
                      style={{ backgroundColor: labelColor, width: 10 }}
                    >
                      {' '}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  }
}

export default TrelloCard;
