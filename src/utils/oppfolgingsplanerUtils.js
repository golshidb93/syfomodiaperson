const oppfolgingsplanerValidNow = (oppfolgingsplaner) => {
    return oppfolgingsplaner.filter((plan) => {
        return new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) > new Date() && plan.godkjentPlan.deltMedNAV;
    });
};

const planerSortedDescendingByDeltMedNAVTidspunkt = (oppfolgingsplaner) => {
    return oppfolgingsplaner.sort((a, b) => {
        return new Date(b.godkjentPlan.deltMedNAVTidspunkt) - new Date(a.godkjentPlan.deltMedNAVTidspunkt);
    });
};

const virksomheterWithPlan = (oppfolgingsplaner) => {
    const uniqueVirksomheter = new Set(oppfolgingsplaner.map((plan) => {
        return plan.virksomhet.virksomhetsnummer;
    }));

    return [...uniqueVirksomheter];
};

const firstPlanForEachVirksomhet = (oppfolgingsplaner, virksomheter) => {
    const newestPlanPerVirksomhet = [];

    virksomheter.forEach((nummer) => {
        const newestPlanForVirksomhetsnummer = oppfolgingsplaner.find((plan) => {
            return plan.virksomhet.virksomhetsnummer === nummer;
        });
        newestPlanPerVirksomhet.push(newestPlanForVirksomhetsnummer);
    });

    return newestPlanPerVirksomhet;
};

const newestPlanForEachVirksomhet = (oppfolgingsplaner) => {
    const sortedPlaner = planerSortedDescendingByDeltMedNAVTidspunkt(oppfolgingsplaner);

    const virksomheter = virksomheterWithPlan(sortedPlaner);

    return firstPlanForEachVirksomhet(sortedPlaner, virksomheter);
};

export const activeOppfolgingsplaner = (oppfolgingsplaner) => {
    const newestPlans = newestPlanForEachVirksomhet(oppfolgingsplaner);
    return oppfolgingsplanerValidNow(newestPlans);
};
