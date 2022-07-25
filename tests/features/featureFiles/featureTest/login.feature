Feature: _Login

  @webdriverIOScenario1
  Scenario: As a user, I can log in with correct username and password

    Given I am on the login page _Login
    When I fill in Username with _Login
    When I fill in Password with _Login
    When I click login button _Login
    Then I should be on the users home page _Login
    Then I click logout _Login

  @webdriverIOScenario2
  Scenario: As a user, I will get an error message when log in with wrong username and correct password

    Given I am on the login page _Login
    When I fill in wrong Username with _Login
    When I fill in Password with _Login
    When I click login button _Login
    Then I should get an error message _Login

  @webdriverIOScenario3
  Scenario: As a user, I will get an error message when log in with correct username and wrong password

    Given I am on the login page _Login
    When I fill in Username with _Login
    When I fill in wrong Password with _Login
    When I click login button _Login
    Then I should get an error message _Login