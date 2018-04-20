const system = require("system");

const screenshots = true;

var casper = require("casper").create({
  pageSettings: {
    loadImages: true,
    loadPlugins: true,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  },
  viewportSize: {
    width: 1600,
    height: 950,
  },
});

var name, email, password, success;

// Get random user
casper.start("https://randomapi.com/api/b19dc533e3f32fe63216479a9a294504?sole&fmt=raw", function() {
  var src = JSON.parse(this.getPageContent());
  name = src.first + " " + src.last;
  email = src.email;
  password = src.pass;
});

// Create user account
casper.thenOpen("https://mobile.twitter.com/signup?type=email", function() {
  this.waitForSelector("#oauth_signup_client_fullname", function() {

    // Input user/email
    this.sendKeys("#oauth_signup_client_fullname",     name);
    this.sendKeys("#oauth_signup_client_phone_number", email);
    screenshot("create_user_account");

    // Random wait
    this.wait(Math.random()*2000+2000, function() {

      // Click sign up
      this.click("input[value='Sign up']");

    });

  });
});

 // Fill out password
 casper.waitForSelector("#password", function() {
  this.sendKeys("#password", password);
  screenshot("password");

  // Random wait
  this.wait(Math.random()*2000+2000, function() {

    // Click sign up
    this.click("input[value='Next']");

  });
});

// Log the current step
casper.on("resource.requested", function(requestData, networkRequest) {
  switch(requestData.url) {
    case "https://randomapi.com/api/b19dc533e3f32fe63216479a9a294504?sole&fmt=raw":
      //console.log("[1/4] Fetching random user data");
      break;

    case "https://mobile.twitter.com/signup?type=email":
      //console.log("[2/4] Accessing Mobile Twitter registration page");
      break;

    case "https://mobile.twitter.com/signup/submit":
      //console.log("[3/4] Submitting registration information");
      break;

    case "https://mobile.twitter.com/signup/add_phone":
      //console.log("[4/4] Account created successfully :D");
      console.log(JSON.stringify({email: email, password: password}));
      break;

    case "https://twitter.com/account/access":
      //console.log("[4/4] Failed to create account :(");
      console.log(JSON.stringify({error: "Failed to create account"}));
      this.exit();
      break;
  }
});

casper.run();

function screenshot(name) {
  var screenshotIndex = 0;

  (screenshot = function(name) {
    if (screenshots) {
      casper.then(function() {
        this.capture("debug/createAccount" + (name ? "(" + name + ")" : "") + "_" + ++screenshotIndex + ".png");
      });
    }
  })(name);
}
