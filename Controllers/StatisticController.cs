using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using melee_notes.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Data.SqlClient;

namespace melee_notes.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticController : ControllerBase
    {
        private readonly MeleeNotesContext _context;

        public StatisticController(MeleeNotesContext context)
        {
            _context = context;
        }

        // POST: api/Statistic/GetSetsWon/User/5
        [HttpPost("GetSetsWon/User/{userId}")]
        public ActionResult<int> GetSetsWon(long userId, Statistic statistic)
        {
            if (statistic == null)
            {
                return NotFound();
            }

            string sql = "SELECT * FROM \"Sets\" "
                     + "INNER JOIN \"Tournaments\" ON \"Sets\".\"TournamentId\" = \"Tournaments\".\"Id\" "
                     + "INNER JOIN \"Players\" ON \"Sets\".\"PlayerId\" = \"Players\".\"Id\" "
                     + "INNER JOIN \"Users\" ON \"Sets\".\"UserId\" = \"Users\".\"Id\" "
                     + "WHERE (\"Sets\".\"UserId\" = {0}::bigint) "
                     + "AND \"Sets\".\"Outcome\" = 'Won' "
                     + "AND \"Tournaments\".\"Date\" BETWEEN {1}::date AND {2}::date "
                     + "AND (\"Sets\".\"Format\" LIKE {3}) "
                     + "AND (\"Sets\".\"Type\" LIKE {4}) ";
            if (statistic.PlayerId == "0")
                sql += "AND (\"Sets\".\"PlayerId\" > '0') ";
            else
                sql += "AND (\"Sets\".\"PlayerId\" = {5}::bigint) ";

            var setsWon = _context.Sets.FromSql(
                sql,
                userId,
                statistic.StartDate,
                statistic.EndDate,
                "%" + statistic.Format + "%",
                "%" + statistic.Type + "%",
                statistic.PlayerId
            ).Count();

            return new JsonResult(setsWon);
        }

        // POST: api/Statistic/GetSetsLost/User/5
        [HttpPost("GetSetsLost/User/{userId}")]
        public ActionResult<int> GetSetsLost(long userId, Statistic statistic)
        {
            if (statistic == null)
            {
                return NotFound();
            }

            string sql = "SELECT * FROM \"Sets\" "
                     + "INNER JOIN \"Tournaments\" ON \"Sets\".\"TournamentId\" = \"Tournaments\".\"Id\" "
                     + "INNER JOIN \"Players\" ON \"Sets\".\"PlayerId\" = \"Players\".\"Id\" "
                     + "INNER JOIN \"Users\" ON \"Sets\".\"UserId\" = \"Users\".\"Id\" "
                     + "WHERE (\"Sets\".\"UserId\" = {0}::bigint) "
                     + "AND \"Sets\".\"Outcome\" = 'Lost' "
                     + "AND \"Tournaments\".\"Date\" BETWEEN {1}::date AND {2}::date "
                     + "AND (\"Sets\".\"Format\" LIKE {3}) "
                     + "AND (\"Sets\".\"Type\" LIKE {4}) ";
            if (statistic.PlayerId == "0")
                sql += "AND (\"Sets\".\"PlayerId\" > '0') ";
            else
                sql += "AND (\"Sets\".\"PlayerId\" = {5}::bigint) ";

            var setsLost = _context.Sets.FromSql(
                sql,
                userId,
                statistic.StartDate,
                statistic.EndDate,
                "%" + statistic.Format + "%",
                "%" + statistic.Type + "%",
                statistic.PlayerId
            ).Count();

            return new JsonResult(setsLost);
        }
    }
}