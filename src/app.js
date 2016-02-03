/**
 * You should completely ignore this code. :) This is mostly a hodge-podge of
 * copy-pasted code to keep state together. Our real application is much cleaner.
 */
window.App = React.createClass({
	getInitialState() {
		return {
			dateRange: {
				startDate: new Date(1451628000000),
				endDate: new Date(1454220000000)
			},
			oldSections: [
				{ id: '1', className: '_1', dimmed: false, value: 50 },
				{ id: '2', className: '_2', dimmed: false, value: 70 },
				{ id: '3', className: '_3', dimmed: false, value: 30 },
				{ id: '4', className: '_4', dimmed: false, value: 15 }
			],
			oldHoveredSection: null,
			newSections: [
				{ id: '1', className: '_1', dimmed: false, value: 50 },
				{ id: '2', className: '_2', dimmed: false, value: 70 },
				{ id: '3', className: '_3', dimmed: false, value: 30 },
				{ id: '4', className: '_4', dimmed: false, value: 15 }
			],
			newHoveredSection: null
		};
	},

	toggleSectionOld() {
		if (this.state.oldSections.length === 4) {
			this.setState({
				oldSections: this.state.oldSections.slice(1)
			});
		} else {
			this.setState({
				oldSections: [{ id: '1', className: '_1', dimmed: false, value: 50 }].concat(this.state.oldSections)
			});
		}
	},

	toggleSectionNew() {
		if (this.state.newSections.length === 4) {
			this.setState({
				newSections: this.state.newSections.slice(1)
			});
		} else {
			this.setState({
				newSections: [{ id: '1', className: '_1', dimmed: false, value: 50 }].concat(this.state.newSections)
			});
		}
	},

	render() {
		return (
			<div>
				<div>
					<h2 style={{margin: '10px 0'}}>
						Old Date Range Picker
					</h2>
					<DateRangePickerOld
						initialStartDate={new Date(1451628000000)}
						initialEndDate={new Date(1454220000000)}
						onDateRangeSelected={() => {}}
					/>
				</div>

				<hr />

				<div>
					<h2 style={{margin: '10px 0'}}>
						New Date Range Picker
					</h2>
					<DateRangePickerNew
						startDate={this.state.dateRange.startDate}
						endDate={this.state.dateRange.endDate}
						onDateRangeUpdated={(startDate, endDate) => {
							this.setState({ dateRange: { startDate, endDate } });
						}}
						onConfirmSelection={() => {}}
					/>
				</div>

				<hr />

				<div>
					<h2 style={{margin: '10px 0'}}>
						Old Donut Chart
					</h2>
					<DonutChartOld
						sections={this.state.oldSections.map((section) => {
							return $.extend(section, {
								dimmed: (this.state.oldHoveredSection ? this.state.oldHoveredSection === section.id : false)
							});
						})}
						diameter={250}
						donutWidth={45}
						onMouseEnter={(sectionId) => {
					        this.setState({ oldHoveredSection: sectionId });
					    }}
						onMouseLeave={() => {
					        this.setState({ oldHoveredSection: null });
					    }}
					/>
					<button onClick={this.toggleSectionOld}>
						Toggle Section
					</button>
				</div>

				<hr />

				<div>
					<h2 style={{margin: '10px 0'}}>
						New Donut Chart
					</h2>
					<DonutChartNew
						sections={this.state.newSections.map((section) => {
							return $.extend(section, {
								dimmed: (this.state.newHoveredSection ? this.state.newHoveredSection === section.id : false)
							});
						})}
						diameter={250}
						donutWidth={45}
					    onMouseEnter={(sectionId) => {
					        this.setState({ newHoveredSection: sectionId });
					    }}
					    onMouseLeave={() => {
					        this.setState({ newHoveredSection: null });
					    }}
					/>
					<button onClick={this.toggleSectionNew}>
						Toggle Section
					</button>
				</div>
			</div>
		);
	}
});