import React from 'react';
import axios from 'axios';
import PropsTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import PropsRoute from './PropsRoute';
import Event from './Event'
import Header from './Header';
import EventList from './EventList';
import EventForm from './EventForm';
import { success } from '../helpers/notifications';
import { handleAjaxError } from '../helpers/helpers';

class Editor extends React.Component {
    constructor(props){
        super(props);

        this.addEvent = this.addEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.updateEvent = this.updateEvent.bind(this);

        this.state = {
            events: null,
        };
    }

    componentDidMount() {
        axios
            .get('/api/events.json')
            .then(response => this.setState({ events: response.data }))
            .catch(handleAjaxError);
    }

    addEvent(newEvent){
        axios
            .post('/api/events.json', newEvent)
            .then((response) => {
                success('Event Added!');
                const savedEvent = response.data;
                this.setState(prevState => ({
                    events: [...prevState.events, savedEvent],
                }));
                const { history } = this.props;
                history.push(`/events/${savedEvent.id}`);
            })
            .catch(handleAjaxError);
    }

    deleteEvent(eventId){
        const sure = window.confirm('Are you sure?');
        if(sure){
            axios
                .delete(`/api/events/${eventId}.json`)
                .then((response) => {
                    if (response.status === 204){
                        success('Event deleted');
                        const { history } = this.props;
                        history.push('/events');

                        const { events } = this.state;
                        this.setState({ events: events.filter(event => event.id !== eventId) });
                    }
                })
                .catch(handleAjaxError);
        }
    }

    updateEvent(updateEvent){
        axios
            .put(`/api/events/${updateEvent.id}.json`, updateEvent)
            .then(() => {
                success('Event updated');
                const { events } = this.state;
                const idx = events.findIndex(event => event.id === updateEvent.id);
                events[idx] = updateEvent;
                const { history } = this.props;
                history.push(`/events/${updateEvent.id}`);
                this.setState({ events });
            })
            .catch(handleAjaxError);
    }

    render(){
        const { events } = this.state;
        if ( events == null ) return null;
        const { match } = this.props;
        const eventId = match.params.id;
        const event = events.find(e => e.id === Number(eventId));

        return (
            <div>
                <Header />
                <div className = "grid">
                    <EventList events = {events} activeId = {Number(eventId)} />
                    <Switch>
                        <PropsRoute path = "/events/new" component = {EventForm} onSubmit = {this.addEvent} />
                        <PropsRoute path = "/events/:id/edit" component = {EventForm} event = {event} onSubmit = {this.updateEvent} />
                        <PropsRoute path = "/events/:id" component = {Event} event = {event} onDelete = {this.deleteEvent} />              
                    </Switch>
                </div>
            </div>
        );
    }
}

Editor.propsTypes = {
    match: PropsTypes.shape(),
    history: PropsTypes.shape({ push: PropsTypes.func }).isRequired,
};

Editor.defaultProps = {
    match: undefined,
};

export default Editor;