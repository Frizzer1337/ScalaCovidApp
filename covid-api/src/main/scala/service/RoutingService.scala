package com.frizzer.covidapp
package service

import com.frizzer.covidapp.*
import cats.effect.{ExitCode, IO, IOApp}
import cats.implicits.*
import cats.syntax.*
import com.comcast.ip4s.*
import com.frizzer.covidapp.entity.{Country, CountryResponse, CovidData, CovidDataResponse}
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, Json}
import org.http4s.circe.*
import org.http4s.circe.CirceEntityCodec.circeEntityEncoder
import org.http4s.client.JavaNetClientBuilder
import org.http4s.dsl.io.*
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.implicits.uri
import org.http4s.server.Router
import org.http4s.{EntityDecoder, EntityEncoder, HttpRoutes, Request}

val basicUrl = uri"https://api.covid19api.com/"

implicit val countryDecoder: Decoder[List[Country]] = Decoder.decodeList[Country]
implicit val countryListDecoder: EntityDecoder[IO, List[Country]] = jsonOf[IO, List[Country]]

implicit val listCovidDecoder: Decoder[List[CovidData]] = Decoder.decodeList[CovidData]
implicit val listDecoder: EntityDecoder[IO, List[CovidData]] = jsonOf[IO, List[CovidData]]

object StartDate extends QueryParamDecoderMatcher[String]("from")

object EndDate extends QueryParamDecoderMatcher[String]("to")

val httpClient = JavaNetClientBuilder[IO].create

val singleCountryService: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case request@GET -> Root / "countries" / name :? StartDate(startDate) +& EndDate(endDate) => {
    val uri = basicUrl / "country" / name +? ("from", startDate) +? ("to", endDate)
    (for {
      data <- httpClient.expect[List[CovidData]](Request[IO](uri = uri))
      response <- Ok(mapData(data.filter(_.Province.isEmpty)).drop(1).asJson)
    } yield response)
      .adaptError { case e =>
        e.printStackTrace()
        e
      }
  }
}

val countriesService: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case request@GET -> Root / "countries" => {
    val uri = basicUrl / "countries"
    (for {
      data <- httpClient.expect[List[Country]](Request[IO](uri = uri))
      response <- Ok(mapCountries(data).asJson)
    } yield response)
      .adaptError { case e =>
        e.printStackTrace()
        e
      }
  }
}

def mapData(data: List[CovidData]): List[CovidDataResponse] = {
  data.foldLeft(List[CovidDataResponse]()) { (acc, covidData) =>
    var prev = 0
    if (acc.isEmpty) {
      prev = covidData.Confirmed
    }
    else {
      prev = prev + covidData.Confirmed - acc.last.confirmedTotal
    }
    if (acc.isEmpty) {
      acc :+ CovidDataResponse(covidData.ID, covidData.Country, covidData.Confirmed, covidData.Date, 0)
    } else {
      acc :+ CovidDataResponse(covidData.ID, covidData.Country, covidData.Confirmed, covidData.Date, prev)
    }
  }
}

def mapCountries(data: List[Country]): List[CountryResponse] = {
  data.foldLeft(List[CountryResponse]()) { (acc, country) =>
    acc :+ CountryResponse(country.Country, country.Slug, country.ISO2)
  }
}
