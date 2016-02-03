/**
 * This is (mostly) our current iteration of the date range picker. It runs the jQuery UI
 * datepicker function on the initial render, then runs it again on every update after
 * it tears down the old version. It's a controlled component now.
 *
 * If you see any bugs, keep in mind this is a stripped down example. Our production
 * date picker is fairly well battle-tested. :)
 */
window.DateRangePickerNew = React.createClass({

	/**
	 * We have a controlled component now, so we supply the current values,
	 * not just the initial values. We also have two separate callbacks:
	 * one for when the values change and one for when the values are confirmed.
	 */
	propTypes: {
		startDate: React.PropTypes.instanceOf(Date).isRequired,
		endDate: React.PropTypes.instanceOf(Date).isRequired,
		onDateRangeUpdated: React.PropTypes.func.isRequired,
		onConfirmSelection: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		this.createDatePickers();
	},

	componentDidUpdate() {
		this.destroyDatePickers();
		this.createDatePickers();
	},

	createDatePickers() {
		$(this.refs.startCalendar).datepicker({
			localToday: new Date(),
			maxDate: this.props.endDate,
			defaultDate: this.props.startDate,
			dateFormat: '@',

			/**
			 * We're no longer updating the component or DOM state. We simply send
			 * the new dates to the consuming component to deal with.
			 */
			onSelect: (timestampString) => {
				const startDate = new Date(parseInt(timestampString, 10));
				this.props.onDateRangeUpdated(startDate, this.props.endDate);
			}
		});

		$(this.refs.endCalendar).datepicker({
			localToday: new Date(),
			minDate: this.props.startDate,
			maxDate: new Date(),
			defaultDate: this.props.endDate,
			dateFormat: '@',
			onSelect: (timestampString) => {
				const endDate = new Date(parseInt(timestampString, 10));
				this.props.onDateRangeUpdated(this.props.startDate, endDate);
			}
		});
	},

	destroyDatePickers() {
		$(this.refs.startCalendar).datepicker('destroy');
		$(this.refs.endCalendar).datepicker('destroy');
	},

	confirmSelection() {
		this.props.onConfirmSelection();
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