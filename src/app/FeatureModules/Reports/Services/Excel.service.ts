import * as XLSX from 'xlsx'; 

export class ExcelService {
	
exportexcel( element : any, fileName : string)
    {
        
       /* table id is passed over here */     
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
       
       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb,fileName);
			
    }
}