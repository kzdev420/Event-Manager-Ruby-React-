import React from 'react';
import PropsTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

import { formatDate, isEmptyObject, validateEvent } from '../helpers/helpers';


class EventForm extends React.Component {
    constructor(props){
        super(props);

        this.dateInput = React.createRef();
        this.state = {
            event: props.event,
            errors: {},
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputtChange = this.handleInputtChange.bind(this);
    }

    componentDidMount() {
        new Pikaday({
            field: this.dateInput.current,
            toString: date => formatDate(date),
            onSelect: (date) => {
                const formattedDate = formatDate(date);
                this.dateInput.current.value = formattedDate;
                this.updateEvent('event_date', formattedDate);
            },
        });
    }

    componentWillReceiveProps({ event }){
        this.setState({ event });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const { event } = this.state;
        const errors = validateEvent(event);
        if(!isEmptyObject(errors)){
            this.setState({ errors });
        } else {
            const { onSubmit } = this.props;
            onSubmit(event);
        }
        console.log('submitted');
    }

    handleInputtChange(detail) {
        const { target } = detail;
        const { name } = target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.updateEvent(name, value);
    }

    updateEvent(key, value) {
        this.setState(prevState => ({
          event: {
            ...prevState.event,
            [key]: value,
          },
        }));
    }

    renderErrors(){
        const { errors } = this.state;
        
        if (isEmptyObject(errors)) {
            return null;
        }

        return(
            <div className = "errors">
                <h3>The following errors prohibited the event from being saved:</h3>
                <ul>
                    {Object.values(errors).map(error => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            </div>
        );
    }

    render() {
        
        const { event } = this.state;
        const cancelURL = event.id ? `/events/${event.id}` : '/events';
        const title = event.id ? `${event.event_date}-${event.event_type}` : 'New Event';

        return (
            <div>
                <h2>{title}</h2>
                {this.renderErrors()}
                <form className="eventForm" onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="event_type">
                            <strong>Type:</strong>
                            <input type="text" id="event_type" name="event_type" onChange = {this.handleInputtChange} value={event.event_type} />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="event_date">
                        <strong>Date:</strong>
                        <input type="text" id="event_date" name="event_date" ref = {this.dateInput} autoComplete = "off" value={event.event_date} onChange = {this.handleInputtChange}/>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="title">
                        <strong>Title:</strong>
                        <textarea cols="30" rows="10" id="title" name="title" onChange = {this.handleInputtChange} value={event.title} />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="speaker">
                        <strong>Speakers:</strong>
                        <input type="text" id="speaker" name="speaker" onChange = {this.handleInputtChange} value={event.speaker} />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="host">
                        <strong>Hosts:</strong>
                        <input type="text" id="host" name="host" onChange = {this.handleInputtChange} value={event.host} />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="published">
                        <strong>Publish:</strong>
                        <input type="checkbox" id="published" name="published" onChange = {this.handleInputtChange} checked={event.published} />
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="submit">Save</button>
                        <Link to = {cancelURL}>Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}

EventForm.propTypes = {
    event: PropsTypes.shape(),
    onSubmit: PropsTypes.func.isRequired,
};

EventForm.defaultProps = {
    event: {
        event_type: '',
        event_date: '',
        title: '',
        speaker: '',
        host: '',
        published: false,
    },
}

export default EventForm;