// Borderlands DPS Calculator - JavaScript edition!
//============================================================================
// v0.07 - added weapon name box.
//       - added an array list for weapon name / calculated dps.
//       - added new functions for grabbing elements.
// v0.06 - allowed "DamagexPellets" (ie. 7x18) damage to be calculated.
//       - adjusted textbox widths on html file.
// v0.05 - added guardian rank passive bonuses to calculator.
//       - reload speed passive bonus is bugged so I disabled it.
//       - updated html form to reflect new changes.
// v0.04 - added elemental damage and element chance to the math formula.
//       - updated the html file to include an option to add elemental data.
//       - cleaned up javascript code (removed redundant code).
//       - added a newer error alert code.
//       - added new functions to calculator.
// v0.03 - introduced an html file with form elements that can be manipulated
//       - adjusted code in the javascript. added css code to html file.
// v0.02 - added an error alert function
//       - updated safety checks
//       - fixed an accidental bug in code.
// v0.01 - initial start of project totally works
//============================================================================
var WeaponDamage; var WeaponAccu; var ReloadSpeed;
var FireRate; var MagSize; var ElementalDamage = 0; var ElementalChance;
var guardWepDMG; var guardWepACC; var guardWepRS; var guardWepFR;
var b_gd_p; var b_gacc_p; var b_grs_p; var b_gfr_p;
var secMF = 0; var secMFR = 0; var TotalMagDamage = 0;
var FinalDPS; var AlertMSG; var resAcc; var resDmg; var resFr; var resRs;
var NewDPS; var NumSav = 0;
var myDPSList = new Array();

function roundNumber(number, decimals) {
    var newnumber = new Number(number+"").toFixed(parseInt(decimals));
    return parseFloat(newnumber);
}
function getWeaponDamage(){
	return document.getElementById("wDamage").value;
}
function getWeaponAccu(){
	return document.getElementById("wAccu").value;
}
function getMagSize(){
	return document.getElementById("wMagSize").value;
}
function getReloadSpeed(){
	return document.getElementById("wReloadSpeed").value;
}
function getFireRate(){
	return document.getElementById("wFirerate").value;
}
function getElementalDamage(){
	return document.getElementById("wEleDamage").value;
}
function getElementalChance(){
	return document.getElementById("wEleChance").value;
}
function WeaponName(){
	return document.getElementById("wWepName").value;
}
function WeaponCalculatedDPS(){
	return document.getElementById("CalcDPS").value;
}
function GuardianWeaponDamage(){
	return document.getElementById("wGDB").value;
}
function GuardianWeaponFireRate(){
	return document.getElementById("wGFRB").value;
}
function GuardianWeaponAccuracy(){
	return document.getElementById("wGAB").value;
}
function GuardianWeaponReloadSpeed(){
	return document.getElementById("wGRSB").value;
}
function ErrAlert(eCode, objName){
	let oN = objName;
	switch(eCode){
		case 0:
			AlertMSG = "[Error 0] - Cannot compute " + oN + " is less than one";
			document.getElementById("CalcDPS").value = AlertMSG;
		break;
		case 1:
			AlertMSG = "[Error 1] - " + oN + " does not contain valid numbers";
			document.getElementById("CalcDPS").value = AlertMSG;
		break;
	}
}
function UpdateNum(){
	NumSav = NumSav + 1;
}
function SaveToList(){
	AddToArray(WeaponName(), WeaponCalculatedDPS());
	SaveResDisplay();
}
function DisplayList() {
   var e = "<hr/>";   
   
   for (var y=0; y<myDPSList.length; y++)
   {
	 tempY = y + 1;
     e += tempY + " = " + myDPSList[y] + "<br/>";
   }
   document.getElementById("Result").innerHTML = e;
}
function SaveResDisplay(){
	var e = "<hr/>";
	UpdateNum();
	e += "Saved: " + WeaponName() + " to List at #" + NumSav + "<br/>";

	document.getElementById("SaveResult").innerHTML = e;
}
function AddToArray(WeaponName, WeaponSustainedDPS){
	myDPSList.push("Weapon Name: " + WeaponName + " - DPS: " + WeaponSustainedDPS);
}
function BLCalculate(){
		if (ElementalDamage < 1 || ElementalChance < 1 || isNaN(ElementalDamage) || isNaN(ElementalChance)) {
			BLC(0); //base calculations.
		} else if (isNaN(WeaponAccu) || WeaponAccu < 1) { //no weapon accuracy :)
			BLC(1); //base + elemental calculations.
		} else { //hopefully they have weapon accuracy.
			BLC(2);
		}
	}
function BLC(choice){
	switch(choice){
		case 0:
			reg_calc();
			break;
		case 1:
			ele_calc();
			break;
		case 2:
			ele_acc_calc();
			break;
		case 3:
			guard_ele_acc_calc(); 
	}
}
function run_datacheck(){ //runs a small input data check.
	//if base values have no valid numbers we cannot compute.
	if (isNaN(MagSize)) {
		ErrAlert(1,"magazine size");
	}
	if (isNaN(FireRate)) {
		ErrAlert(1,"firerate");
	}
	if (isNaN(ReloadSpeed)) {
		ErrAlert(1,"reload speed");
	}	
	if (isNaN(WeaponDamage)) {
		ErrAlert(1,"weapon damage");
	}
	//if base values are less than 1 than we cannot compute.
	if (MagSize < 1) {
		ErrAlert(0,"magazine size");
	}
	if (FireRate < 1) {
		ErrAlert(0,"firerate");
	}
	if (WeaponDamage < 1) {
		ErrAlert(0,"weapon damage");
	}
	if (ReloadSpeed < 1) {
		ErrAlert(0,"reload speed");
	}
}
function ele_calc(){ //calculate with elemental chance/damage.
	let testy = WeaponDamage;
	testy = testy.replace("x","*");
	let NewDPS = eval(testy);
	run_datacheck();

	let secEle = Number(ElementalChance / 1000 * 10).toFixed(3); //0.345% ?
	let secMF = Number(MagSize / FireRate).toFixed(3);
	let secMFR = Number(secMF + ReloadSpeed).toFixed(3);
	let zebra = Number(ElementalDamage * secEle).toFixed(3);
	let TotalMagDamage = Number(MagSize * NewDPS);
	let FinalDPS = Number((TotalMagDamage / secMFR) + zebra).toFixed(3); 

	x = FinalDPS.toString();

    document.getElementById("CalcDPS").value = x;
	console.log("Weapon DPS (+Elemental): " + x);
}

function ele_acc_calc(){ //calculate with elemental chance/damage with base accuracy data.
	let testy = WeaponDamage;
	testy = testy.replace("x","*");
	let NewDPS = eval(testy);
	run_datacheck();

	let secEle = Number(parseFloat((ElementalChance / 1000) * 10).toFixed(3)); //34.5 = 0.345% ?
	let secAcc = Number(parseFloat((WeaponAccu / 1000) * 10).toFixed(3)); //convert accuracy to a percentage!
	let secMF = Number(parseFloat(MagSize / FireRate));
	let secMFR = Number(parseFloat(secMF + ReloadSpeed));
	let zebra = Number(parseFloat(ElementalDamage * secEle));
	let TotalMagDamage = Number(parseFloat(MagSize * NewDPS));
	let FinalDPS = Number(parseFloat(secAcc * (((TotalMagDamage / secMFR) + zebra))).toFixed(2)); 

	x = FinalDPS.toString();

    document.getElementById("CalcDPS").value = x;
	console.log("Weapon DPS (+Elemental+Accuracy): " + x);
}

 function sum(input){
             
	if (toString.call(input) !== "[object Array]")
	   return false;
		 
			   var total =  0;
			   for(var i=0;i<input.length;i++)
				 {                  
				   if(isNaN(input[i])){
				   continue;
					}
					 total += Number(input[i]);
				  }
				return total;
			   }

function guard_ele_acc_calc(){ //calculate with elemental chance/damage with base accuracy data.
	let testy = WeaponDamage;
	testy = testy.replace("x","*");
	let NewDPS = eval(testy);
	run_datacheck();
	let b_gd_p = parseFloat((guardWepDMG / 1000) * 10).toFixed(3); //bonus damage
	console.log("b_gd_p:" + b_gd_p);
	let b_gacc_p = parseFloat((guardWepACC / 1000) * 10).toFixed(3); //bonus accuracy
	console.log("b_gacc_p: " + b_gacc_p);
	let b_grs_p = parseFloat((guardWepRS / 1000) * 10).toFixed(3); //bonus reload speed
	console.log("b_grs_p: " + b_grs_p);
	let b_gfr_p = parseFloat((guardWepFR / 1000) * 10).toFixed(2); //bonus fire rate
	console.log("b_gfr_p: " + b_gfr_p);
	let secEle = parseFloat((ElementalChance / 1000) * 10).toFixed(3); //34.5 = 0.345% ?
	console.log("secEle: " + secEle);
	let secAcc = parseFloat((WeaponAccu / 1000) * 10).toFixed(3); //convert accuracy to a percentage!
	console.log("secAcc: " + secAcc);
	var FrBonus = parseFloat((FireRate/1000)*10);
	FrBonus = FrBonus+1*b_gfr_p;
	console.log("FrBonus: " + FrBonus);
	let secMF = parseFloat(roundNumber((MagSize / FrBonus), 2));//* (1 + b_gfr_p))+"%"); //with bonus gun firerate
	console.log("secMF: " + secMF);
if (isNaN(guardWepRS) || guardWepRS < 1) { // gotta check ReloadSpeed
    let RsBonus = ReloadSpeed; // no change
    console.log(("RsBonus: " + RsBonus));
    secMFR = parseFloat(sum([secMF, ReloadSpeed]));//(secMF + RsBonus)+"%");
    console.log("secMFR: " + secMFR);
} else if (guardWepRS > 1) {
	console.log("ReloadSpeed = " + ReloadSpeed);
	let RsBonus2 = parseFloat(sum([ReloadSpeed, b_grs_p]));//Math.ceil(ReloadSpeed * b_grs_p);//RsBonus + 1 * insertDecimal(guardWepRS);// + 1 * b_grs_p;
	console.log(("RsBonus2: " + RsBonus2));
	secMFR = parseFloat(sum([secMF, RsBonus2]));//(secMF + RsBonus)+"%");
	console.log("secMFR: " + secMFR);
}
	let zebra = parseFloat(sum([ElementalDamage * secEle]).toFixed(3));
	console.log("zebra: " + zebra); //elemental reee
	let resDmg = parseFloat(sum([NewDPS * (1 + b_gd_p)])).toFixed(3);
	console.log("resDmg: " + resDmg);
	let TotalMagDamage = parseFloat(sum([MagSize * resDmg])).toFixed(3);
	console.log("TotalMagDamage: " + TotalMagDamage);
	resAcc = parseFloat(sum([secAcc * (1 + b_gacc_p)])).toFixed(4); //+ b_gacc_p); //bonus acc + acc
	console.log("Bonus resAcc: " + resAcc);
	let FinalDPS = parseFloat(sum([resAcc * (((TotalMagDamage / secMFR) + zebra))])).toFixed(2);
	console.log("FinalDPS: " + FinalDPS);
	x = FinalDPS;

    document.getElementById("CalcDPS").value = x;
	console.log("Weapon DPS (+Elemental+Accuracy): " + x);
}
function reg_calc(){ //calculate without elemental chance/damage.
	let testy = WeaponDamage;
	testy = testy.replace("x","*");
	let NewDPS = eval(testy);
	run_datacheck();

	let secMF = parseFloat(MagSize / FireRate);
	let secMFR = parseFloat(sum([secMF, ReloadSpeed]));
	let TotalMagDamage = parseFloat(MagSize * NewDPS);
	let FinalDPS = parseFloat(TotalMagDamage / secMFR).toFixed(2); 

	x = FinalDPS.toString();
	console.log("Weapon DPS: " + x);
	document.getElementById("CalcDPS").value = x;
}
function submit(){ //grabs form values to use in javascript.
	WeaponDamage = getWeaponDamage();
	WeaponAccu = getWeaponAccu();
	MagSize = getMagSize();
	ReloadSpeed = getReloadSpeed();
	FireRate = getFireRate();
	ElementalDamage = getElementalDamage();
	ElementalChance = getElementalChance();
	BLCalculate();
}
function submit2(){ //guardian submit
	WeaponDamage = getWeaponDamage();
	WeaponAccu = getWeaponAccu();
	MagSize = getMagSize();
	ReloadSpeed = getReloadSpeed();
	FireRate = getFireRate();
	ElementalDamage = getElementalDamage();
	ElementalChance = getElementalChance();
	//guardian passives
	guardWepDMG = GuardianWeaponDamage();
	guardWepFR = GuardianWeaponFireRate();
	guardWepACC = GuardianWeaponAccuracy();
	guardWepRS = 0;//GuardianWeaponReloadSpeed();//0; // document.getElementById("wGRSB").value;
	BLC(3);
}
function clearText(){ //clears out old values on form.
	document.getElementById("wDamage").value = "";
	document.getElementById("wAccu").value = "";
	document.getElementById("wMagSize").value = "";
	document.getElementById("wReloadSpeed").value = "";
	document.getElementById("wFirerate").value = "";
	document.getElementById("wEleDamage").value = "";
	document.getElementById("wEleChance").value = "";
	//guardian
	document.getElementById("wGDB").value = "";
	document.getElementById("wGFRB").value = "";
	document.getElementById("wGAB").value = "";
	//wGRSB
	document.getElementById("CalcDPS").value = "0";
}
function openGitHub(){
	window.open("http://web.archive.org/web/20191009203337/https://github.com/LeftBased/Borderlands-Weapon-DPS-Calculator-JavaScript")
}
function openDonate(){
	window.open("http://web.archive.org/web/20191009203337/https://paypal.me/internprimas")
}
/*
     FILE ARCHIVED ON 20:33:37 Oct 09, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 06:06:41 Feb 24, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  esindex: 0.018
  exclusion.robots.policy: 0.251
  PetaboxLoader3.datanode: 194.648 (4)
  captures_list: 249.139
  CDXLines.iter: 13.405 (3)
  exclusion.robots: 0.266
  PetaboxLoader3.resolve: 70.576 (2)
  load_resource: 84.619
  LoadShardBlock: 202.309 (3)
  RedisCDXSource: 28.993
*/