/**
 * This was our first attempt at a date range picker. This example has been trimmed down
 * to just the basics. Our original picker was much more complicated, especially the state
 * that it had to maintain. But this exemplifies the issues we were running into.
 *
 * The way this version works is by running the jQuery UI datepicker function just once,
 * then listening for changes using the built-in callbacks and mutating our state in
 * response to those callbacks. The consumer of this component was only aware of changes
 * when the dates were confirmed by the user.
 *
 * If you see any bugs, keep in mind this is a stripped down example. Our production
 * date picker is fairly well battle-tested. :)
 */
window.DateRangePickerOld = React.createClass({

	/**
	 * This is an uncontrolled component, so we only supplied an initial values.
	 */
	propTypes: {
		initialStartDate: React.PropTypes.instanceOf(Date).isRequired,
		initialEndDate: React.PropTypes.instanceOf(Date).isRequired,
		onDateRangeSelected: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			startDate: this.props.initialStartDate,
			endDate: this.props.initialEndDate
		};
	},

	componentDidMount() {
		$(this.refs.startCalendar).datepicker({
			localToday: new Date(),
			maxDate: this.state.endDate,
			defaultDate: this.state.startDate,
			dateFormat: '@',

			/**
			 * Notice that we have to mutate the component state and the DOM calendar.
			 * This was to ensure our state matched jQuery UI's DOM state.
			 */
			onSelect: (timestampString) => {
				const startDate = new Date(parseInt(timestampString, 10));
				this.setState({ startDate });
				$(this.refs.endCalendar).datepicker('option', 'minDate', startDate);
			}
		});

		$(this.refs.endCalendar).datepicker({
			localToday: new Date(),
			minDate: this.state.startDate,
			maxDate: new Date(),
			defaultDate: this.state.endDate,
			dateFormat: '@',

			/**
			 * Same thing as above: we had to mutate component and DOM state.
			 */
			onSelect: (timestampString) => {
				const endDate = new Date(parseInt(timestampString, 10));
				this.setState({ endDate });
				$(this.refs.startCalendar).datepicker('option', 'maxDate', endDate);
			}
		});
	},

	/**
	 * We handled all of the DOM updates by ourselves after the initial render.
	 */
	shouldComponentUpdate() {
		return false;
	},

	confirmSelection() {
		this.props.onDateRangeSelected(this.state.startDate, this.state.endDate);
	},

	render() {
		return (
			<div>
				<div>
					<div ref='startCalendar' style={{display: 'inline-block', marginRight: '20px'}} />
					<div ref='endCalendar' style={{display: 'inline-block', marginRight: '20px'}} />
				</div>
				<button onClick={this.confirmSelection}>
					Confirm
				</button>
			</div>
		);
	}
});