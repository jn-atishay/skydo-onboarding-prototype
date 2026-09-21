/**
 * @author Raj Sheth
 * created: 21/02/24
 */

export const UBOS_QUERY = `
query getExporterUser {
    exporterUser {
        exporter {
            ubo {
                id
                fullName
                isPrimary
            }
            exporterScreeningResults {
                isSanctionAlertsAvailable
                isScreeningComplete
            }
        }
    }
}
`;
