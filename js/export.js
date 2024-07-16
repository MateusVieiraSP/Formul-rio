// Função para exportar dados para um arquivo Excel
async function exportToExcel() {
    // Recupera os dados das etapas do sessionStorage
    const etapas = JSON.parse(sessionStorage.getItem('etapas')) || [];

    // Cria uma nova planilha no workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ProcessData');

    // Define as colunas e seus cabeçalhos com largura personalizada
    worksheet.columns = [
        { header: 'ID', key: 'type', width: 20 },
        { header: 'Nome da etapa ou subetapa', key: 'etapa', width: 25 },
        { header: 'Objetivo da etapa ou subetapa', key: 'objetivo', width: 40 },
        { header: 'Recursos humanos utilizados', key: 'recursos', width: 40 },
        { header: 'Dados pessoais utilizados', key: 'pessoais', width: 40 },
        { header: 'Recursos físicos utilizados', key: 'fisicos', width: 40 },
        { header: 'Recursos tecnológicos utilizados', key: 'tecnologicos', width: 40 },
        { header: 'Comunicação e compartilhamento das informações', key: 'comunicacao', width: 40 },
        { header: 'Taxonomia dos recursos informacionais (informações geradas)', key: 'taxonomia', width: 40 },
        { header: 'Taxonomia dos recursos informacionais (documentos gerados)', key: 'informacionais', width: 40 }
    ];

    // Adiciona dados
    etapas.forEach(etapa => {
        worksheet.addRow(etapa);
    });

    // Aplica estilo aos cabeçalhos
    const headerStyle = {
        font: { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    worksheet.getRow(1).eachCell(cell => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
        cell.border = headerStyle.border;
    });

    // Aplica estilo às células de dados
    const dataStyle = {
        font: { name: 'Arial', size: 12 },
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    };

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) {
            row.eachCell(cell => {
                cell.font = dataStyle.font;
                cell.alignment = dataStyle.alignment;
                cell.border = dataStyle.border;
            });
        }
    });

    // Adiciona formatação condicional (exemplo: colorir células com base em valores)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        row.eachCell(cell => {
            if (cell.value === 'High Priority') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC7CE' } };
            }
        });
    });

    // Gera o arquivo e faz o download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ProcessData.xlsx';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
}

// Define a função exportToExcel como global
window.exportToExcel = exportToExcel;
