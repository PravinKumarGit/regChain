
	var result;
	/*
		Calculating amount, adjusted and down payment for FHA loan type
		Formula => 	Amount		= SP * LTV / 100
				   	Adjusted 	= amount + (amount * MIP / 100)					
					DownPayment = SP - Amount
	*/
	export function getRefAmountFHA( request ){
		var amount;
		amount 			= request.salePrice * request.LTV/100;								//Formula applied here to calculate the amount
		adjusted 		= parseInt(amount) + ( parseInt(amount) * request.MIP/100 );		//Formula applied here to calculate the adjusted
		downPayment 	= request.salePrice - parseInt(amount);								//calculating down payment
		
		//creating result object
		result = {
			amount		:amount,
			adjusted	:adjusted,
			downPayment	:downPayment
		}; 
		return result;
	}

	/*
		Calculating amount and down payment for Conventional loan type
		Formula => 	Amount 		= SP * LTV / 100
					DownPayment = SP - Amount
	*/
	export function getRefAmountConventional( request ){
		var amount, amount2 = '0.00';
		amount 			= request.salePrice * request.LTV/100;				//Formula applied here to calculate the amount
		downPayment 	= request.salePrice;
		//console.log(request.LTV2);
		if(request.LTV2 > 0){
			//console.log("in condition = " + request.LTV2);
			amount2 		= request.salePrice * request.LTV2/100;				//Formula applied here to calculate the amount
			downPayment 	= downPayment - amount2;						//calculating down payment
		}

		downPayment 	= downPayment - amount;						//calculating down payment
		
		//creating result object
		result = {
			amount		:amount,
			amount2		:amount2,
			downPayment	:downPayment
		}; 
		return result;
	}

	/*
		Calculating adjusted amount for VA loan type
		Formula => 	Adjusted 	= amount + (amount * FF / 100)					
	*/
	export function getRefAdjustedVA( request ){
		var adjusted;
		//console.log(request);
		adjusted 	= parseInt(request.salePrice) + ( parseInt(request.salePrice) * request.FF/100 );		//Formula applied here to calculate the adjusted

		//creating result object
		result = {
			amount		:request.salePrice,
			adjusted	:adjusted,
			downPayment	:0
		}; 
		return result;
		//return adjusted;

	}
	/*
		Calculating adjusted amount for USDA loan type
		Formula => 	Adjusted 	= amount + (amount * MIP / 100)					
	*/
	export function getRefAdjustedUSDA( request ){
		var adjusted;

		adjusted 	= parseInt(request.salePrice) + ( parseInt(request.salePrice) * request.MIP/100 );		//Formula applied here to calculate the Adjusted

		//creating result object
		result = {
			amount		:request.salePrice,
			adjusted	:adjusted,
			downPayment	:0
		}; 
		return result;

	}
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getRefDiscountAmount( request ){
		var discount;
		if((request.amount === undefined || request.amount === '') || (request.discountPerc === undefined || request.discountPerc === '')){
			return result = { discount : 0 };
		}
		discount 	= parseInt(request.amount) * parseInt(request.discountPerc)/100 ;		//Formula applied here to calculate the discount amount
		//creating result object
		result = {
			discount		:discount
		}; 
		return result;

	}
	/*
		Calculating origination fee
		Formula => 	originationFee 	= amount * origination fee percentage / 100
	*/
	export function getRefOriginationFee( request ){
		var originationFee;
		if(request.amount2 > 0){
			request.amount = request.amount + request.amount2
		}

		originationFee 	= parseInt(request.amount) * parseInt(request.originationFee)/100 ;		//Formula applied here to calculate the origination Fee
		
		//creating result object
		result = {
			originationFee		:parseFloat(originationFee).toFixed( 2 )
		}; 
		return result;

	}
	/*
		Calculating Prepaid Monthly Tax
		Formula => 	prepaidMonthTaxes	= (Sales Price * Monthly tax rate/12) * Months / 100 
		
	*/
	export function getRefPreMonthTax( request ){
		var prepaidMonthTaxes;
		prepaidMonthTaxes 	= (parseInt(request.salePrice) * request.monthlyTax/12) * parseInt(request.months)/100 ;		//Formula applied here to calculate the prepaid month tax
		
		//creating result object
		result = {
			prepaidMonthTaxes		:prepaidMonthTaxes
		}; 
		return result;

	}

	/*
		Calculating Real Estate Taxes
		Formula => 	realEstateTaxes	= monthlyInsurance / months		
	*/
	export function getRefRealEstateTaxes( request ){
		var realEstateTaxes;
		realEstateTaxes 	= (request.prepaidMonthTaxesRes / request.months);		//Formula applied here to calculate the Real Estate Taxes
		
		//creating result object
		result = {
			realEstateTaxes		:parseFloat(realEstateTaxes).toFixed( 2 )
		}; 
		return result;

	}

	/*
		Calculating monthly insurance
		Formula => 	monthlyInsurance	= (Sales Price * 4 / 12) * 15 / 1000 
		
	*/
	export function getRefMonthlyInsurance( request ){
		var monthInsurance;
		
		monthInsurance 	= (parseInt(request.salePrice) * request.insuranceRate/12) * request.months/1000 ;		//Formula applied here to calculate the monthly insurance
		
		//creating result object
		result = {
			monthInsurance		:monthInsurance
		}; 
		return result;

	}

	/*
		Calculating Homw Owner insurance
		Formula => 	monthlyInsurance	= monthInsuranceRes / months 
		
	*/
	export function getRefHomeOwnerInsurance( request ){
		var homeOwnerInsuranceRes;
		//console.log(request);
		homeOwnerInsuranceRes 	= (parseFloat(request.monthInsuranceRes) / parseFloat(request.months)) ;		//Formula applied here to calculate the monthly Homw Owner insurance
		//console.log(homeOwnerInsuranceRes);
		//creating result object
		result = {
			homeOwnerInsuranceRes		: parseFloat(homeOwnerInsuranceRes).toFixed( 2 )
		}; 
		return result;

	}

	/*
		Calculating Tax & Insurance
		Formula => 	monthlyInsurance	= realEstateTaxesRes + homeOwnerInsuranceRes 
		
	*/
	export function getRefAdjustmentTaxInt( request ){
		var adjustmentTaxIntRes;
		
		adjustmentTaxIntRes 	= (parseFloat(request.homeOwnerInsuranceRes) + parseFloat(request.realEstateTaxesRes)) ;		//Formula applied here to calculate the monthly Homw Owner insurance
		//console.log(adjustmentTaxIntRes);
		//creating result object
		result = {
			adjustmentTaxIntRes		:adjustmentTaxIntRes
		}; 
		return result;

	}
	
	/*
		Calculating days interest
		Formula => 	monthlyInsurance	=  (Adjusted * Interest rate / 360) * days / 100
		
	*/
	export function getRefDailyInterest( request ){
		var daysInterest;
		console.log(request);
		daysInterest 	= (parseFloat(request.adjusted) * parseFloat(request.interestRate) / 360) * parseFloat(request.days)/100 ;		//Formula applied here to calculate the days interest
		
		//creating result object
		result = {
			daysInterest		:parseFloat(daysInterest).toFixed( 2 )
		}; 
		//console.log(result);
		return result;

	}

	/*
		Calculating FHa MIP Finance for Prepaid section
		Formula => 	FhaMipFin	=  amount * MIP / 100
		
	*/
	export function getRefFhaMipFinance( request ){
	
		var FhaMipFin, FhaMipFin1, FhaMipFin2;
		FhaMipFin		= request.amount * request.MIP/100;								//Formula applied here to calculate the FhaMipFin
		FhaMipFin 		= parseFloat(FhaMipFin).toFixed( 2 );
		var res 		= FhaMipFin.split(".");
		FhaMipFin1		= res[0] + ".00";
		FhaMipFin2		= "0." + res[1];
		//creating result object
		result = {
			FhaMipFin		:FhaMipFin,
			FhaMipFin1		:FhaMipFin1,
			FhaMipFin2		:FhaMipFin2,
		}; 
		return result;

	}
	/*
		Calculating VA Funding Finance for prepaid section
		Formula => 	VaFfFinance 	= amount * FF / 100
	*/
	export function getRefVaFundingFinance( request ){
		var VaFfFin, VaFfFin1, VaFfFin2;
		//console.log(request);
		VaFfFin 		= parseInt(request.salePrice) * request.FF/100 ;				//Formula applied here to calculate the VaFfFin
		VaFfFin 		= parseFloat(VaFfFin).toFixed( 2 );
		var res 		= VaFfFin.split(".");
		VaFfFin1		= res[0] + ".00";
		VaFfFin2		= "0." + res[1];

		//creating result object
		result = {
			VaFfFin		:VaFfFin,
			VaFfFin1	:VaFfFin1,
			VaFfFin2	:VaFfFin2
		}; 
		return result;
		//return adjusted;

	}
	/*
		Calculating USDA MIP Finance for prepaid section
		Formula => 	UsdaMipFinance 	= amount * FF / 100
	*/
	export function getRefUsdaMipFinance( request ){
		var UsdaMipFinance, UsdaMipFinance1, UsdaMipFinance2;
		//console.log(request);
		UsdaMipFinance 		= parseInt(request.salePrice) * request.MIP/100 ;				//Formula applied here to calculate the UsdaMipFinance
		UsdaMipFinance 			= parseFloat(UsdaMipFinance).toFixed( 2 );
		var res 			= UsdaMipFinance.split(".");
		UsdaMipFinance1			= res[0] + ".00";
		UsdaMipFinance2			= "0." + res[1];

		//creating result object
		result = {
			UsdaMipFinance		:UsdaMipFinance,
			UsdaMipFinance1		:UsdaMipFinance1,
			UsdaMipFinance2		:UsdaMipFinance2
		}; 
		return result;
		//return adjusted;

	}

	/*
		Calculating annual adjustments
		Formula => 	
	*/
	export function getRefAnnualAdjustment( request ){
		var amount, interestRate, termsInYear, interestRateCap, perAdjustment, rate;

		amount			= request.amount;
		interestRate	= request.interestRate; 
		termsInYear		= request.termsInYear
		interestRateCap	= request.interestRateCap;
		perAdjustment	= request.perAdjustment;
		adjustments		= [];

		for(var i = 1; i <= 5; i++){
			interestRate  = parseFloat(perAdjustment) + parseFloat(interestRate);
			adjustments.push(getRefSumOfAdjustment(amount, interestRate, termsInYear));
			
		}
		//console.log(adjustments[0]);

		//creating result object
		result = {
			adjustment1	:adjustments[0],
			adjustment2	:adjustments[1],
			adjustment3	:adjustments[2],
			adjustment4	:adjustments[3],
			adjustmentN	:adjustments[4]
		}; 
		return result;
		
		
	}

	export function getRefSumOfAdjustment(amount, interestRate, termsInYear){
		
		sum1 = interestRate/1200;
		sum2 = sum1 + 1;
		sum3 = termsInYear * 12;
		sum4 = Math.pow(sum2, sum3);

		printRate = '0.00';
		if(amount != 0 && sum1 != 0 && sum3 !=0){
			
        	printRate = (amount * (sum1 * sum4)) / (sum4 - 1);
        	printRate = printRate.toFixed(2);
		}
		return printRate;
	}

	/*
		Calculating Monthly Rate MMI
		Formula => 	monthlyRateMMI 	= amount * rateValue / 12 * 100
	*/
	export function getRefMonthlyRateMMI(request){
		
		var monthlyRateMMI;
		
		monthlyRateMMI 		= (parseInt(request.amount) * request.rateValue) / (12 * 100) ;				//Formula applied here to calculate the UsdaMipFinance
	
		//creating result object
		result = {
			monthlyRateMMI		:monthlyRateMMI.toFixed(2)
		}; 
		return result;
	}


	/*
		Calculating Total Prepaid Items
		Formula => 	totalPrepaidItems 	= add all request data
	*/
	export function getRefTotalPrepaidItems(request){
		
		var totalPrepaidItems;
		totalPrepaidItems 		= parseFloat(request.prepaidMonthTaxesRes) + parseFloat(request.monthInsuranceRes) + parseFloat(request.daysInterestRes) + parseFloat(request.financialVal) + parseFloat(request.prepaidAmount);				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalPrepaidItems		:totalPrepaidItems
		}; 
		return result;
	}

	/*
		Calculating Total Monthly Payment
		Formula => 	totalMonthlyPayment 	= add all request data
	*/
	export function getRefTotalMonthlyPayment(request){
		
		var totalMonthlyPayment;
		totalMonthlyPayment 		= parseFloat(request.principalRate) + parseFloat(request.realEstateTaxesRes) + parseFloat(request.homeOwnerInsuranceRes) + parseFloat(request.monthlyRate) + parseFloat(request.paymentAmount1) + parseFloat(request.paymentAmount2);				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalMonthlyPayment		:totalMonthlyPayment.toFixed( 2 )
		}; 
		return result;
	}
	
	/*
		Calculating Total Investment
		Formula => 	totalInvestment 	= add all request data
	*/
	export function getRefTotalInvestment(request){
		
		var totalInvestment;
		
		totalInvestment 		= parseFloat(request.amount) - parseFloat(request.totalClosingCost) - parseFloat(request.totalPrepaidItems) - parseFloat(request.existingTotal) ;				//Formula applied here to calculate the Total Prepaid Items
		
		//creating result object
		result = {
			totalInvestment		:totalInvestment.toFixed( 2 )
		}; 
		return result;
	}

	/*
		Calculating Cost Type Total 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getRefCostTypeTotal(request){
		
		var totalCostRate;
		console.log(request);
		if(request.type == 'Flat Fee'){
			totalCostRate	= parseFloat(request.rate);
		}
		if(request.type == '% Sale Price'){
			totalCostRate	= request.rate * request.salePrice / 100;
		}
		if(request.type == '% Loan'){
			totalCostRate	= request.rate * request.amount / 100;
		}
		//creating result object
		result = {
			totalCostRate		:totalCostRate.toFixed( 2 )
		}; 
		return result;
	}
	/*
		Calculating Toal Cost Rate 
		Formula => 	totalCostRate	= parseFloat(request.rate);							//for flat rate
					totalCostRate	= request.rate * request.salePrice / 100;			//for sale price
					totalCostRate	= request.rate * request.amount / 100;				//for loan
	*/
	export function getRefTotalCostRate(request){
		
		var totalCostRate;
			
		totalCostRate	= parseFloat(request.cost1) + parseFloat(request.cost2) + parseFloat(request.cost3) + parseFloat(request.cost4) + parseFloat(request.cost5) + parseFloat(request.cost6) + parseFloat(request.cost7) + parseFloat(request.cost8) + parseFloat(request.cost9) + parseFloat(request.cost10);
		//creating result object
		result = {
			totalCostRate		: totalCostRate
		}; 
		return result;
	}

	/*
		Calculating existing balance and rate
		Formula => 	daysInterest	= existing_total / 365 * days;
	*/
	export function getRefExistingBalanceCalculation(request){
		
		var daysInterest;
		console.log(request);	
		existing1	= request.existing_bal1 * request.existing_rate1 / 100;
		existing2	= request.existing_bal2 * request.existing_rate2 / 100;
		existing3	= request.existing_bal3 * request.existing_rate3 / 100;
		
		existing_total	= existing1 + existing2 + existing3;
		totalBalance	= parseFloat(request.existing_bal1) + parseFloat(request.existing_bal2) + parseFloat(request.existing_bal3);
		console.log(existing_total);
		daysInterest	= existing_total / 360 * request.days;
		totalBalance	= totalBalance + daysInterest;
		//creating result object
		result = {
			daysInterest		: daysInterest.toFixed( 2 ),
			existingTotal		: totalBalance.toFixed( 2 )
		}; 
		return result;
	}
//getBuyerEstimatedTax
	/*
		Calculating discount amount
		Formula => 	discount 	= amount * discountPerc / 100
	*/
	export function getRefEstimatedTax( request ){
	
		if(request.date >= '28' && request.month == '2'){
			request.date	= '30';
		}
		if(request.date == '31'){
			request.date	= '30';
		}
		if(request.proration > '0'){
			estimatedPro 		= request.proration - 30 + ( request.date - 1 );
			dailypropertyTax	= request.annualPropertyTax / 360;
			estimatedTax		= estimatedPro * dailypropertyTax.toFixed( 2 );
		}

		if(request.proration < '0'){
			estimatedPro 		= Math.abs(request.proration) - 30 + ( request.date + 1 );
			dailypropertyTax	= request.annualPropertyTax / 360;
			estimatedTax		= estimatedPro * dailypropertyTax.toFixed( 2 );
			estimatedTax		= -Math.abs(estimatedTax);
		}

		if(request.proration == '0'){
			estimatedTax		= Math.abs(request.proration);
		}

		//creating result object
		result = {
			estimatedTax		: estimatedTax.toFixed( 2 )
		}; 
		return result;

	}	

	/*
		Calculating Actual Annual Tax
		Formula => 	monthlyTaxRes	= annualPropertyTax * prepaidMonthTaxes1 * 30 / 365;
	*/
	export function getActualAnnualTax(request){
		
		var monthlyTaxRes;
		monthlyTaxRes	= request.annualPropertyTax * request.prepaidMonthTaxes1 * 30 / 360;

		result = {
			monthlyTaxRes		: monthlyTaxRes.toFixed( 2 )
		}; 
		console.log(monthlyTaxRes);	
		return result;
	}	

	/*
		Calculating Actual Annual Tax
		Formula => 	monthlyInsRes	= annualPropertyIns * prepaidMonthInsurance / 12;
	*/
	export function getActualAnnualIns(request){
		
		var monthlyInsRes;
		monthlyInsRes	= request.annualPropertyIns * request.prepaidMonthInsurance / 12;

		result = {
			monthlyInsRes		: monthlyInsRes.toFixed( 2 )
		}; 
		console.log(monthlyInsRes);	
		return result;
	}	

	/*
		Calculating 2nd TD 
		Formula => 	
	*/
	export function get2ndTd(request){
		
		var year		= request.termsInYear;
		var amount		= request.amount;
		var rate		= request.interestRate;
			
		sum1 = rate / 1200;
		sum2 = sum1 + 1;
    	sum3 = year * 12;
    	sum4 = Math.pow(sum2, sum3);
    
		pnintrate = '0.00';
		if (amount != '0.00' && sum1 != '0.00' && sum3 != '0')
		{
			pnintrate = (amount * (sum1 * sum4)) / (sum4 - 1);
			pnintrate = pnintrate.toFixed(2);
			//pnintrate = numberFormat(pnintrate);
		}
		//creating result object
		result = {
			pnintrate		: pnintrate
		}; 
		return result;
	}


