/**
 * This was (roughly) our first attempt at a donut chart. Learning from our date
 * picker, we decide we would tear the chart out of the DOM every time a change
 * was made. This resulted in poor animations adn the hover bug I described.
 *
 * Despite being much shorter and easier to understand, this was not the right
 * way to do it (at least for us).
 */
window.DonutChartOld = React.createClass({
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
	 * A complete re-render every time.
	 */
	componentDidUpdate() {
		$(this.getDOMNode()).empty();
		this.buildChart();
	},

	buildChart() {
		const radius = this.props.diameter / 2;
		const innerRadius = radius - this.props.donutWidth;

		const arc = d3.svg.arc().
			innerRadius(innerRadius).
			outerRadius(radius);

		const pie = d3.layout.pie()
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

		// These mouse events accurately depict the mouse bug I was running into,
		// only it's much more obvious when written in this manner.
		const g = svg.selectAll('.arc')
			.data(pie(this.props.sections))
			.enter().append('g')
			.on('mouseenter', (datum, index) => {
				this.props.onMouseEnter(datum.data.id);
			})
			.on('mouseleave', () => {
				this.props.onMouseLeave();
			});

		g.append('path')
			.attr('d', arc)
			.attr('class', (datum) => {
				return (datum.data.dimmed ? `arc _dim  ${datum.data.className}` : `arc ${datum.data.className}`)
			});
	},

	render() {
		return <div ref='svgContainer' />;
	}
});