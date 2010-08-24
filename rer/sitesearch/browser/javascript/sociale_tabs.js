/*
 * Integrazione con portlettabber
 */

jq(document).ready(function() {
	try {
		var generatedPortlet = jq.tabbedportlet({
			id: 'tabbing'
		});
		generatedPortlet.makeTab("#portal-column-two .portletCollection:contains(Le altre notizie)", {
			label: 'Notizie'
		});
		generatedPortlet.makeTab("#portal-column-two .portletRSSmixerportlet:contains(Le altre notizie)", {
			label: 'Notizie'
		});
		generatedPortlet.makeTab("#portal-column-two .portletCollection:contains(Prossimi appuntamenti)", {
			label: 'Agenda'
		});
		generatedPortlet.makeTab("#portal-column-two .portletCollection:contains(Gli ultimi documenti)", {
			label: 'Documenti'
		});
		jq("#portal-column-two .visualPadding").append(generatedPortlet.getPortlet());
	} catch(error) {
		if (window.console) {
			window.console.log("Errore caricando i tab: " + error.message);
		}
	};
});
