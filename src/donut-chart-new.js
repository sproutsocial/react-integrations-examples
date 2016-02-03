/**
 * This was our second (and current) attempt at a donut chart. Instead of tearing
 * down and rebuilding every time, this one saved the DOM state and used D3 to
 * update the existing DOM nodes to transition them to the new state. This chart
 * is a bit more code, and a bit harder to understand, but it enabled animations
 * and fixed the bug we were encountering.
 *
 * (Note that the animations here aren't perfect. Getting them to look good in
 * many scenarios is a LOT of code and fairly confusing. I left that out for
 * brevity.)
 */
window.DonutChartNew = React.createClass({
	propTypes: {
		sections: React.PropTypes.arrayOf(React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			value: React.PropTypes.number.isRequired,
			dimmed: React.PropTypes.bool,
			className: React.PropTypes.string
		})).isRequired,
		diameter: React.PropTypes.number.isRequired,
		donutWidth: React.PropTypes.number.isRequired,
		onMouseEnter: React.PropTypes.func.isRequired,
		onMouseLeave: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		this.buildChart();
	},

	/**
	 * Instead of a re-render, we update the existing DOM.
	 */
	componentDidUpdate() {
		this.updateChart();
	},

	buildChart() {
		const radius = this.props.diameter / 2;
		const innerRadius = radius - this.props.donutWidth;

		this.arc = d3.svg.arc().
			innerRadius(innerRadius).
			outerRadius(radius);

		this.pie = d3.layout.pie()
			.value((section) => section.value);

		const svgContainer = this.refs.svgContainer;

		// Render the SVG container and move it based on the margins
		const svg = d3.select(svgContainer).
			append('svg').
				attr('width', this.props.diameter).
				attr('height', this.props.diameter).
				attr('viewBox', '0 0 ' + this.props.diameter + ' ' + this.props.diameter).
				attr('perserveAspectRatio', 'xMinYMin meet').
				append('g').
					attr('transform', 'translate(' + radius + ',' + radius + ')');

		this.path = svg.selectAll('path');

		this.updateChart();
	},

	/**
	 * This is all D3-specific, but we find the exiting DOM elements and
	 * use D3 to transition them to the new state they should be in. The
	 * elements are never removed completely, just updated.
	 */
	updateChart() {
		const arc = this.arc;

		this.path = this.path.data(this.pie(this.props.sections), (datum) => datum.data.id);

		this.path.enter().
			append('path').
				attr('class', (datum) => `arc ${datum.data.className || ''}`).
				on('mouseenter', (datum) => {
					this.props.onMouseEnter(datum.data.id);
				}).
				on('mouseleave', (datum) => {
					this.props.onMouseLeave(datum.data.id);
				}).
				each(function(datum) {
					this._currentDatum = datum;
				});

		this.path.exit().
			transition().
				remove();

		this.path.
			classed('_dim', (datum) => datum.data.dimmed).
			transition().
				duration(1000).
				attrTween('d', function(datum) {
					const interpolate = d3.interpolate(this._currentDatum, datum);
					this._currentDatum = datum;

					return (interval) => {
						return arc(interpolate(interval));
					};
				});
	},

	render() {
		return <div ref='svgContainer' />;
	}
});