package com.frizzer.covidapp

import entity.*
import service.*

import org.scalatest.funsuite.AnyFunSuite

import scala.language.postfixOps

class RoutingServiceTest extends AnyFunSuite {

  test("Test that map countries is working properly") {
    val expectedResult: List[CountryResponse] = List(
      CountryResponse("Belarus", "by", "byb"),
      CountryResponse("Ukraine", "ua", "uau")
    )
    val startingData: List[Country] = List(
      Country("Belarus", "by", "byb"),
      Country("Ukraine", "ua", "uau")
    )
    assert(mapCountries(startingData).equals(expectedResult))
  }

  test("Test that map data is working properly") {
    val expectedResult: List[CovidDataResponse] = List(
      CovidDataResponse("id", "country", 100, "date", 0),
      CovidDataResponse("id", "country", 150, "date", 50),
      CovidDataResponse("id", "country", 200, "date", 50)
    )

    val startingData: List[CovidData] = List(
      CovidData("id", "country", "", 100, "date"),
      CovidData("id", "country", "", 150, "date"),
      CovidData("id", "country", "", 200, "date")
    )
    assert(mapData(startingData).equals(expectedResult))
  }


}
