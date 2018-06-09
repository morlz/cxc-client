var tablesToExcel = (function() {
	var uri = 'data:application/vnd.ms-excel;base64,',
		tmplWorkbookXML = `
		<?xml version="1.0"?>
		<?mso-application progid="Excel.Sheet"?>
		<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
			<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
				<Author>Axel Richter</Author>
				<Created>{created}</Created>
			</DocumentProperties>
			<Styles>
				<Style ss:ID="Currency">
					<NumberFormat ss:Format="Currency"></NumberFormat>
				</Style>

				<Style ss:ID="Date">
					<NumberFormat ss:Format="Medium Date"></NumberFormat>
				</Style>

				<Style ss:ID="Text">
					<Alignment ss:WrapText="1"/>
					<Borders>
				     <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
				     <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
				     <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
				     <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
				    </Borders>
				</Style>

				<Style ss:ID="Center">
					<Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
					<Borders>
				     <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
				     <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
				     <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
				     <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
				    </Borders>
				</Style>

				<Style ss:ID="Header">
					<Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
				</Style>
			</Styles>
			{worksheets}
		</Workbook>
		`,
		tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
		tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}{colspan}{rowspan}{index}><Data ss:Type="{nameType}">{data}</Data></Cell>',
		base64 = function(s) {
			return window.btoa(unescape(encodeURIComponent(s)))
		},
		format = function(s, c) {
			return s.replace(/{(\w+)}/g, function(m, p) {
				return c[p];
			})
		}

	return function(tables, wsnames, wbname, appname) {
		var ctx = "";
		var workbookXML = "";
		var worksheetsXML = "";
		var rowsXML = "";

		tables.map((table, i) => {
			if (!table.nodeType)
				table = document.getElementById(table)

			let tmpRowspans = {}
			let width = table.getAttribute("data-column-width")

			if (width) {
				width = JSON.parse(width)
				Object.keys(width).map(key => rowsXML += `<Column ssIndex="${key}" ss:AutoFitWidth="0" ss:Width="${width[key]}"/>`)
			}


			Array.from(table.rows).map(row => {

				let height = row.getAttribute("data-height")

				rowsXML += height ? `<Row ss:Height="${height}" ss:AutoFitHeight="0">` : '<Row>'

				Array.from(row.cells).map((ceil, ci) => {
					let dataType = ceil.getAttribute("data-type"),
						dataStyle = ceil.getAttribute("data-style") || 'Text',
						dataValue = ceil.getAttribute("data-value"),
						dataFormula = ceil.getAttribute("data-formula"),
						colspan = ceil.getAttribute("colspan"),
						rowspan = ceil.getAttribute("rowspan")

					dataValue = (dataValue) ? dataValue : ceil.innerHTML.replace( /<\/?[^>]+>/g, '' ).trim()
					dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null

					ctx = {
						attributeStyleID: dataStyle ? ' ss:StyleID="' + dataStyle + '"' : '',
						nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String',
						data: (dataFormula) ? '' : dataValue,
						attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : '',
						colspan: colspan ? ` ss:MergeAcross="${+colspan - 1}"` : '',
						rowspan: rowspan ? ` ss:MergeDown="${+rowspan - 1}"` : '',
						index: ''
					}

					if (tmpRowspans[ci]) {
						tmpRowspans[ci]--
						ctx.index = ` ss:Index="${+ci + 2}"`
					}

					if (rowspan)
						tmpRowspans = { [ci]: +rowspan - 1 }

					rowsXML += format(tmplCellXML, ctx)
				})

				rowsXML += '</Row>'
			})

			ctx = {
				rows: rowsXML,
				nameWS: wsnames[i] || 'Sheet' + i
			}

			worksheetsXML += format(tmplWorksheetXML, ctx)

			rowsXML = ""
		})

		ctx = {
			created: (new Date()).getTime(),
			worksheets: worksheetsXML
		};
		workbookXML = format(tmplWorkbookXML, ctx);

		console.log(workbookXML);

		var link = document.createElement("A");
		link.href = uri + base64(workbookXML);
		link.download = wbname || 'Workbook.xls';
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
})();

export default tablesToExcel
