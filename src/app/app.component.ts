import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
//   currentUrl: string;
  
//   constructor( private router : Router, private route : ActivatedRoute){

//   }
  
//   ngOnInit(){
//     
//     this.router.events.subscribe((event: RouterEvent) => { 
// 		
//         	if (event instanceof RoutesRecognized) {
// 				// console.log(this.route);
// 				// console.log(this.router);
// 				const first: any = event.state.root.firstChild;
// 				// if (first) {
// 				// 	const goingToHomePage = event.url === '/' || event.state.root.firstChild.params['referralUsername']
// 				// 	const shouldRedirectToAccountPage = this.userService.isUserLoggedIn() && goingToHomePage && !appInited;
// 				// 	if (shouldRedirectToAccountPage) {
// 				// 		this.router.navigate(['/account']);
// 				// 	}
// 				// }
// 				// App is inited after the first time we recognize routes
// 				// appInited = true;
// 			}


//     //    setTimeout(() => {
//     //     if(event instanceof NavigationStart){
//     //       this.currentUrl = event.url;
//     //     //    const navigatingToHomePage = event.url === '/';
// 	// 	    if(this.currentUrl === '/'){
// 	// 		  this.router.navigateByUrl('/'); 
// 	// 		}else{
// 	// 			this.router.navigateByUrl('');
// 	// 		}
//     //      } 
//     //    }, 100); 
 
//         // if(this.currentUrl != '/'){
//         //   this.router.navigateByUrl(event.url);
//         // }else{
//         //   this.router.navigateByUrl('/'); 
//         // }
//   });

//   }
// }
    // this.router.events.subscribe((event: RouterEvent) => {

			// if (event instanceof RoutesRecognized) {
			// 	console.log(this.route);
			// 	console.log(this.router);
			// 	const first: any = event.state.root.firstChild;
			// 	if (first) {
			// 		const goingToHomePage = event.url === '/' || event.state.root.firstChild.params['referralUsername']
			// 		const shouldRedirectToAccountPage = this.userService.isUserLoggedIn() && goingToHomePage && !appInited;
			// 		if (shouldRedirectToAccountPage) {
			// 			this.router.navigate(['/account']);
			// 		}
			// 	}
			// 	// App is inited after the first time we recognize routes
			// 	appInited = true;
			// }

			// if (event instanceof NavigationStart) {
			// 	this.currentUrl = event.url;
			// 	const navigatingToHomePage = event.url === '/';

			// 	if (!navigatingToHomePage && this.showExtensionInstallButtonInTopNav && !this.installExtensionService.hasExtensionInstalled) {
			// 		this.showExtensionInstallButtonInTopNav = false;
			// 	}
			// 	const usersReferral = cookies.get('referral');

			// 	if (navigatingToHomePage && usersReferral && !this.userService.isUserLoggedIn()) {
			// 		this.router.navigate([`${usersReferral}`]);
			// 	}
			// }

			// if (event instanceof NavigationEnd) {
			// 	window.scrollTo(0, 0);
			// 	this.showSideNavigation = false;
			// } }
 
}
